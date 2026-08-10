/// <reference lib="webworker" />

const EVENT_HORIZON = 2;
const PHOTON_SPHERE = 3;
const DISK_INNER = 6;
const DISK_OUTER = 18;

type TraceRequest = {
  id: number;
  width: number;
  height: number;
  columns: number;
  rows: number;
  cellW: number;
  cellH: number;
  yaw: number;
  pitch: number;
};

const normalize = (x: number, y: number, z: number) => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length] as const;
};

self.onmessage = (event: MessageEvent<TraceRequest>) => {
  const request = event.data;
  const size = request.columns * request.rows;
  const rayKind = new Uint8Array(size);
  const sourceA = new Float32Array(size);
  const sourceB = new Float32Array(size);
  const sourceC = new Float32Array(size);
  const closestRadius = new Float32Array(size);

  const cameraDistance = 32;
  const cosPitch = Math.cos(request.pitch);
  const [cdx, cdy, cdz] = normalize(
    Math.sin(request.yaw) * cosPitch,
    Math.sin(request.pitch),
    Math.cos(request.yaw) * cosPitch,
  );
  const cpx = cdx * cameraDistance;
  const cpy = cdy * cameraDistance;
  const cpz = cdz * cameraDistance;
  const fx = -cdx;
  const fy = -cdy;
  const fz = -cdz;
  const [rx, ry, rz] = normalize(-fz, 0, fx);
  const [ux, uy, uz] = normalize(ry * fz - rz * fy, rz * fx - rx * fz, rx * fy - ry * fx);
  const focalLength = Math.min(request.width, request.height) * 0.5;
  const centerX = request.width * 0.5;
  const centerY = request.height * 0.5;

  for (let row = 0; row < request.rows; row += 1) {
    for (let column = 0; column < request.columns; column += 1) {
      const index = row * request.columns + column;
      const screenX = column * request.cellW + request.cellW * 0.5 - centerX;
      const screenY = row * request.cellH + request.cellH * 0.5 - centerY;
      let [vx, vy, vz] = normalize(
        fx + rx * (screenX / focalLength) - ux * (screenY / focalLength),
        fy + ry * (screenX / focalLength) - uy * (screenY / focalLength),
        fz + rz * (screenX / focalLength) - uz * (screenY / focalLength),
      );
      const ivx = vx;
      const ivy = vy;
      const ivz = vz;
      let px = cpx;
      let py = cpy;
      let pz = cpz;
      const hx = py * vz - pz * vy;
      const hy = pz * vx - px * vz;
      const hz = px * vy - py * vx;
      const h2 = hx * hx + hy * hy + hz * hz;
      let minimumRadius = cameraDistance;
      let result = 0;
      let a = 0;
      let b = 0;
      let c = 0;

      for (let step = 0; step < 950; step += 1) {
        const radius = Math.hypot(px, py, pz);
        if (radius < minimumRadius) minimumRadius = radius;

        if (radius <= EVENT_HORIZON * 1.002) {
          result = 1;
          break;
        }

        if (step > 8 && radius > 42 && px * vx + py * vy + pz * vz > 0) {
          const [evx, evy, evz] = normalize(vx, vy, vz);
          a = Math.atan2(evz, evx);
          b = Math.asin(Math.max(-1, Math.min(1, evy)));
          c = Math.acos(Math.max(-1, Math.min(1, ivx * evx + ivy * evy + ivz * evz)));
          break;
        }

        const stepSize = radius > 22 ? 0.68 : radius > 11 ? 0.24 : radius > 5 ? 0.07 : 0.019;
        const acceleration = (-3 * h2) / Math.pow(radius, 5);
        vx += px * acceleration * stepSize;
        vy += py * acceleration * stepSize;
        vz += pz * acceleration * stepSize;
        const nx = px + vx * stepSize;
        const ny = py + vy * stepSize;
        const nz = pz + vz * stepSize;

        if ((py > 0 && ny <= 0) || (py < 0 && ny >= 0)) {
          const interpolation = py / (py - ny);
          const ix = px + (nx - px) * interpolation;
          const iz = pz + (nz - pz) * interpolation;
          const diskRadius = Math.hypot(ix, iz);
          if (diskRadius >= DISK_INNER && diskRadius <= DISK_OUTER) {
            const azimuth = Math.atan2(iz, ix);
            result = 2;
            a = diskRadius;
            b = azimuth;
            c = -Math.sin(azimuth) * cdx + Math.cos(azimuth) * cdz;
            minimumRadius = Math.min(minimumRadius, diskRadius);
            break;
          }
        }

        px = nx;
        py = ny;
        pz = nz;

        if (step === 949) {
          result = minimumRadius < PHOTON_SPHERE * 1.04 ? 1 : 0;
          const [evx, evy, evz] = normalize(vx, vy, vz);
          a = Math.atan2(evz, evx);
          b = Math.asin(Math.max(-1, Math.min(1, evy)));
          c = Math.acos(Math.max(-1, Math.min(1, ivx * evx + ivy * evy + ivz * evz)));
        }
      }

      rayKind[index] = result;
      sourceA[index] = a;
      sourceB[index] = b;
      sourceC[index] = c;
      closestRadius[index] = minimumRadius;
    }
  }

  self.postMessage(
    {
      id: request.id,
      columns: request.columns,
      rows: request.rows,
      yaw: request.yaw,
      pitch: request.pitch,
      rayKind,
      sourceA,
      sourceB,
      sourceC,
      closestRadius,
    },
    { transfer: [rayKind.buffer, sourceA.buffer, sourceB.buffer, sourceC.buffer, closestRadius.buffer] },
  );
};

export {};
