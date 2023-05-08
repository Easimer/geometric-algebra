export class PGAFlector {
    private constructor(
        readonly sx: number,
        readonly sy: number,
        readonly sz: number,
        readonly sw: number,
        readonly hx: number,
        readonly hy: number,
        readonly hz: number,
        readonly hw: number,
    ) {
    }

    negate(): PGAFlector {
        return new PGAFlector(
            -this.sx,
            -this.sy,
            -this.sz,
            -this.sw,
            -this.hx,
            -this.hy,
            -this.hz,
            -this.hw,
        );
    }

    static fromValues(
        sx: number, sy: number, sz: number, sw: number,
        hx: number, hy: number, hz: number, hw: number,
    ) {
        return new PGAFlector(sx, sy, sz, sw, hx, hy, hz, hw);
    }
}
