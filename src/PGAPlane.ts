import { Vector3 } from "three";
import { PGALine } from "./PGALine";
import { PGAPoint } from "./PGAPoint";

export class PGAPlane {
    private constructor(
        readonly x: number,
        readonly y: number,
        readonly z: number,
        readonly w: number,
    ) {
    }

    distancesFromPoints(p: readonly PGAPoint[]): number[] {
        const denom = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        const dist = new Array<number>(p.length);

        for (let i = 0; i < p.length; i++) {
            const num = Math.abs(p[i].x * this.x + p[i].y * this.y + p[i].z * this.z + p[i].w * this.w);
            dist[i] = num / (denom * Math.abs(p[i].w));
        }

        return dist;
    }

    signedDistancesFromPoints(p: readonly PGAPoint[]): number[] {
        const denom = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        const dist = new Array<number>(p.length);

        for (let i = 0; i < p.length; i++) {
            const num = p[i].x * this.x + p[i].y * this.y + p[i].z * this.z + p[i].w * this.w;
            dist[i] = num / (denom * p[i].w);
        }

        return dist;
    }

    normal(): Vector3 {
        return new Vector3(
            this.x,
            this.y,
            this.z,
        ).normalize();
    }

    static fromLineAndPoint(L: PGALine, p: PGAPoint) {
        return new PGAPlane(
            L.vy * p.z - L.vz * p.y + L.mx * p.w,
            L.vz * p.x - L.vx * p.z + L.my * p.w,
            L.vx * p.y - L.vy * p.x + L.mz * p.w,
            -(L.mx * p.x + L.my * p.y + L.mz * p.z),
        );
    }

    static perpendicularToLineContainsPoint(L: PGALine, p: PGAPoint) {
        return new PGAPlane(
            -L.vx * p.w,
            -L.vy * p.w,
            -L.vz * p.w,
            L.vx * p.x + L.vy * p.y + L.vz * p.z,
        );
    }
}
