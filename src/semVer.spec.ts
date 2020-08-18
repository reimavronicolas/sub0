import { Expect, Test, TestCase, TestFixture } from 'alsatian';
import { SemVer } from "./semVer";

@TestFixture()
export class SemVerSpec {

    @TestCase('1.0.3', '1.0.2', 1)
    @TestCase('2.0.1', '1.0.2', 1)
    @TestCase('2.0.0', '1.0.2', 1)
    @TestCase('1.1', '1.0.2', 1)
    @TestCase('2', '1.0.2', 1)
    @TestCase('2.0', '1.0.2', 1)
    @TestCase('1', '1.0.2', -1)
    @TestCase('1.0', '1.0.2', -1)
    @TestCase('0.1', '1.0.2', -1)
    @TestCase('1.0.1', '1.0.2', -1)
    @TestCase('0.1.0', '1.0.2', -1)
    @TestCase('1.2', '1.2', 0)
    @TestCase('1', '1', 0)
    @TestCase('1.2.0', '1.2', 0)
    @TestCase('1.0.0', '1', 0)
    @TestCase('1.0.0', '1.0', 0)
    @TestCase('1.2.0-alpha+1123', '1.2', 0)
    @TestCase('1.2-alpha', '1.2', 0)
    @Test('Semantic Version Comparison: Compare()')
    public testCompare(version1: string, version2: string, result: number): void {
        Expect(SemVer.compare(version1, version2)).toEqual(result);
    }

    @Test('Semantic Version Comparison: Lt(), Gt(), Equals()')
    public testGtLtEquals() {
        const version = SemVer.version('9.1.3');
        Expect(version.gt('9.0.0')).toBe(true);
        Expect(version.gt('9.1.4')).toBe(false);
        Expect(version.lt('10.0.4')).toBe(true);
        Expect(version.lt('9.1')).toBe(false);
        Expect(version.equals('9.1.3')).toBe(true);
        Expect(version.equals('9.1')).toBe(false);
    }
}
