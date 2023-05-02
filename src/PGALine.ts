import { Vector3 } from "three";
import { PGAPoint } from "./PGAPoint";

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
}