import { Vector3 } from "three";
import { PGAPoint } from "./PGAPoint";
import { PGAPlane } from "./PGAPlane";

export class PGALine {
    private constructor(
        readonly vx: number,
        readonly vy: number,
        readonly vz: number,
        readonly mx: number,
        readonly my: number,
        readonly mz: number,
    ) {
    }

    direction(): Vector3 {
        return new Vector3(this.vx, this.vy, this.vz);
    }

    static fromTwoPoints(p: PGAPoint, q: PGAPoint) {
        return new PGALine(
            q.x * p.w - p.x * q.w,
            q.y * p.w - p.y * q.w,
            q.z * p.w - p.z * q.w,
            p.y * q.z - p.z * q.y,
            p.z * q.x - p.x * q.z,
            p.x * q.y - p.y * q.x,
        );
    }

    static fromIntersectionOfTwoPlanes(f: PGAPlane, g: PGAPlane) {
        return new PGALine(
            f.z * g.y - f.y * g.z,
            f.x * g.z - f.z * g.x,
            f.y * g.x - f.x * g.y,
            f.x * g.w - g.x * f.w,
            f.y * g.w - g.y * f.w,
            f.z * g.w - g.z * f.w,
        );
    }
}