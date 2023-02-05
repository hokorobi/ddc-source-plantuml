import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddc_vim@v3.4.0/types.ts";
import {
  Denops,
} from "https://deno.land/x/ddc_vim@v3.4.0/deps.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  _cache: Item[];

  override async onInit(args: {
    denops: Denops;
  }): Promise<void> {
    const p = Deno.run({
      cmd: ["java", "-jar", "C:/ols/Graphic/plantuml.jar", "-language"],
      stdout: "piped",
      stderr: "piped",
      stdin: "null",
    });
    await p.status();

    const lines = new TextDecoder().decode(await p.output()).split(/\r?\n/);
    this._cache = [...new Set(lines)]
      .filter((line) => line.length != 0)
      .filter((word) => !word.startsWith(";"))
      .map((word: string) => ({ word }));
  }

  override async gather(args: {
    denops: Denops;
  }): Promise<Item[]> {
    return this._cache;
  }

  override params(): Params {
    return {};
  }
}