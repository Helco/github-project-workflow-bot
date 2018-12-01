export function OtherTypeValues(except: string | string[]): any[] {
    if (typeof except === "string")
        except = [ except ];
    return [
        123,
        "abc",
        false,
        true,
        null,
        undefined,
        { bla: "bli blubb" },
        function() { console.log("hi"); },
    ].filter(v => except.indexOf(typeof v) < 0);
}
