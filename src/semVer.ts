export class SemVer {
    private version: string;

    constructor(version: string) {
        this.version = version;
    }

    public static compare(version1Str: string, version2Str: string): number {
        const version1 = this.padSliceSemver(this.parseVersion(version1Str));
        const version2 = this.padSliceSemver(this.parseVersion(version2Str));

        for (const [i, v] of version1.entries()) {
            if (v > version2[i]) {
                return 1;
            }

            if (v < version2[i]) {
                return -1;
            }
        }

        return 0;
    }

    public static version(version: string): SemVer {
        return new SemVer(version);
    }

    public gt(version: string): boolean {
        return SemVer.compare(this.version, version) === 1;
    }

    public gteq(version: string): boolean {
        return SemVer.compare(this.version, version) >= 0;
    }

    public lt(version: string): boolean {
        return SemVer.compare(this.version, version) === -1;
    }

    public lteq(version: string): boolean {
        return SemVer.compare(this.version, version) <= 0;
    }

    public equals(version: string): boolean {
        return SemVer.compare(this.version, version) === 0;
    }

    private static parseVersion(version: string): number[] {
        return version
            .split('.')
            .map(v => v.split('-')[0].split('+')[0])
            .map(Number);
    }

    private static padSliceSemver(version: number[]): number[] {
        const newVer = version.slice();
        for(let i = 0; i <= 3 - newVer.length; i++) {
            newVer.push(0);
        }

        return newVer;
    }
}
