import { Vector3 } from "three";
import { PGALine } from "./PGALine";
import { PGAPlane } from "./PGAPlane";

export class PGAPoint {
    private constructor(
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly w: number,
    ) {
    }

    static fromCoords(x: number, y: number, z: number, w: number) {
        return new PGAPoint(x, y, z, w);
    }

    static fromVec3(v: Vector3) {
        return new PGAPoint(v.x, v.y, v.z, 1);
    }

    static fromPlaneAndLine(P: PGAPlane, L: PGALine) {
        return new PGAPoint(
            L.my * P.z - L.mz * P.y + L.vx * P.w,
            L.mz * P.x - L.mx * P.z + L.vy * P.w,
            L.mx * P.y - L.my * P.x + L.vz * P.w,
            -(L.vx * P.x + L.vy * P.y + L.vz * P.z),
        );
    }

    weight() {
        return this.w;
    }

    toVec3(): Vector3 {
        return new Vector3(
            this.x / this.w,
            this.y / this.w,
            this.z / this.w,
        );
    }

    projectToPlane(P: PGAPlane): PGAPoint {
        const s0 = P.x * P.x + P.y * P.y + P.z * P.z;
        const s1 = -(P.x * this.x + P.y * this.y + P.z * this.z + P.w * this.w);

        return PGAPoint.fromCoords(
            s0 * this.x + s1 * P.x,
            s0 * this.y + s1 * P.y,
            s0 * this.z + s1 * P.z,
            s0 * this.w,
        );
    }
}