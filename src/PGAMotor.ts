import { PGAPoint } from "./PGAPoint";
import { PGAFlector } from "./PGAFlector";
import { Vector3 } from "three";

export class PGAMotor {
    private constructor(
        readonly rx: number,
        readonly ry: number,
        readonly rz: number,
        readonly rw: number,
        readonly ux: number,
        readonly uy: number,
        readonly uz: number,
        readonly uw: number,
    ) {
    }

    /**
     * Computes the geometric antiproduct of P and this motor, i.e. `P ⟇ this`
     */
    invGeometricAntiprodWithPoint(P: PGAPoint): PGAFlector {
        const sx = +P.x * (this.rw + this.uw) + P.y * this.rz - P.z * this.ry - P.w * this.ux;
        const sy = -P.x * this.rz + P.y * (this.rw + this.uw) + P.z * this.rx - P.w * this.uy;
        const sz = +P.x * this.ry - P.y * this.rx + P.z * (this.rw + this.uw) - P.w * this.uz;
        const sw = +P.w * this.rw;

        const hx = P.w * this.rx;
        const hy = P.w * this.ry;
        const hz = P.w * this.rz;
        const hw = -P.x * this.rx - P.y * this.ry - P.z * this.rz - P.w * this.uw;

        return PGAFlector.fromValues(sx, sy, sz, sw, hx, hy, hz, hw);
    }

    /**
     * Computes the geometric antiproduct of this motor and P, i.e. `this ⟇ P`
     */
    geometricAntiprodWithPoint(P: PGAPoint): PGAFlector {
        // `this ⟇ P` = `-(P ⟇ this)`
        return this.invGeometricAntiprodWithPoint(P).negate();
    }

    /**
     * Computes the geometric antiproduct of this motor and F, i.e. `this ⟇ F`
     */
    geometricAntiprodWithFlector(F: PGAFlector): PGAFlector {
        const sx = +this.rx * F.hw + this.ry * F.sz - this.rz * F.sy + this.rw * F.sx + this.ux * F.sw + this.uy * F.hz - this.uz * F.hy + this.uw * F.hx;
        const sy = -this.rx * F.sz + this.ry * F.hw + this.rz * F.sx + this.rw * F.sy - this.ux * F.hz + this.uy * F.sw + this.uz * F.hx + this.uw * F.hy;
        const sz = +this.rx * F.sy - this.ry * F.sx + this.rz * F.hw + this.rw * F.sz + this.ux * F.hy - this.uy * F.hx + this.uz * F.sw + this.uw * F.hz;
        const sw = -this.rx * F.hx - this.ry * F.hy - this.rz * F.hz + this.rw * F.sw;

        const hx = +this.rx * F.sw + this.ry * F.hz - this.rz * F.hy + this.rw * F.hx;
        const hy = -this.rx * F.hz + this.ry * F.sw + this.rz * F.hx + this.rw * F.hy;
        const hz = +this.rx * F.hy - this.ry * F.hx + this.rz * F.sw + this.rw * F.hz;
        const hw = -this.rx * F.sx - this.ry * F.sy - this.rz * F.hz + this.rw * F.hw - this.ux * F.hx - this.uy * F.hy - this.uz * F.hz + this.ux * F.sw;

        return PGAFlector.fromValues(sx, sy, sz, sw, hx, hy, hz, hw);
    }

    /**
     * Computes the geometric antiproduct of this motor and q, i.e. `this ⟇ q`
     */
    geometricAntiproductWithMotor(q: PGAMotor): PGAMotor {
        const rx = +this.rx * q.rw + this.ry * q.rz - this.rz * q.ry + this.rw * q.rx;
        const ry = -this.rx * q.rz + this.ry * q.rw + this.rz * q.rx + this.rw * q.ry;
        const rz = +this.rx * q.ry - this.ry * q.rx + this.rz * q.rw + this.rw * q.rz;
        const rw = -this.rx * q.rx - this.ry * q.ry - this.rz * q.rz + this.rw * q.rw;

        const ux = +this.rx * q.uw + this.ry * q.uz - this.rz * q.uy + this.rw * q.ux
            + this.ux * q.rw + this.uy * q.rz - this.uz * q.ry + this.uw * q.rx;
        const uy = -this.rx * q.uz + this.ry * q.uw + this.rz * q.ux + this.rw * q.uy
            - this.ux * q.rz + this.uy * q.rw + this.uz * q.rx + this.uw * q.ry;
        const uz = +this.rx * q.uy - this.ry * q.ux + this.rz * q.uw + this.rw * q.uz
            + this.ux * q.ry - this.uy * q.rx + this.uz * q.rw + this.uw * q.rz;
        const uw = this.rw * q.uw + this.uw * q.rw - this.rx * q.ux - this.ry * q.uy - this.rz * q.uz - this.uz * q.rz - this.uy * q.ry - this.ux * q.rx;

        return new PGAMotor(
            rx, ry, rz, rw,
            ux, uy, uz, uw,
        );
    }

    geometricProductWithMotor(q: PGAMotor): PGAMotor {
        return (this.leftComplement().geometricAntiproductWithMotor(q.leftComplement())).leftComplement();
    }

    leftComplement(): PGAMotor {
        return new PGAMotor(
            -this.rx, -this.ry, -this.rz, +this.uw,
            -this.ux, -this.uy, -this.uz, +this.rw,
        );
    }

    rightComplement(): PGAMotor {
        return this.leftComplement();
    }

    antireverse(): PGAMotor {
        return new PGAMotor(
            -this.rx, -this.ry, -this.rz, +this.rw,
            -this.ux, -this.uy, -this.uz, +this.uw,
        );
    }

    applyToPoint(x: PGAPoint): PGAPoint {
        // `this ⟇ x ⟇ antireverse(this)` == `this ⟇ y`
        const y = this.antireverse().invGeometricAntiprodWithPoint(x);
        const x1 = this.geometricAntiprodWithFlector(y);

        return PGAPoint.fromCoords(x1.sx, x1.sy, x1.sz, x1.sw);
    }

    /**
     * Creates a motor that translates objects by vector `t`
     */
    static fromTranslation(t: Vector3) {
        return new PGAMotor(
            0, 0, 0, 1,
            t.x / 2, t.y / 2, t.z / 2, 0,
        );
    }

    /**
     * Creates a motor that rotates objects by angle `angle` about unix axis
     * `axis` through the origin
     */
    static fromAngleAxis(axis: Vector3, angle: number) {
        const sin = Math.sin(angle / 2);
        const cos = Math.cos(angle / 2);

        return new PGAMotor(
            sin * axis.x,
            sin * axis.y,
            sin * axis.z,
            cos,
            0, 0, 0, 0,
        );
    }
}