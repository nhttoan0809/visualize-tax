import { delay } from "./demo-data";

/** Browser presentation, not operating-system mouse control. Uses the actual UI handlers. */
export class PresentationDriver {
  private reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  private highlighted: Element | null = null;
  constructor(private signal: AbortSignal) {}
  async wait(selector: string, enabled = false): Promise<HTMLElement> {
    for (let i = 0; i < 120; i++) {
      this.signal.throwIfAborted();
      const element = document.querySelector<HTMLElement>(selector);
      if (element && (!enabled || !element.matches(":disabled")))
        return element;
      await delay(70, this.signal);
    }
    throw new Error(
      "Một bước trình diễn chưa sẵn sàng. Bạn có thể dừng và thử lại.",
    );
  }
  async move(selector: string, label: string) {
    const target = await this.wait(selector, true);
    target.scrollIntoView({
      block: "nearest",
      behavior: this.reduced ? "instant" : "smooth",
    });
    await delay(this.reduced ? 20 : 300, this.signal);
    const rect = target.getBoundingClientRect();
    const x = Math.max(
      12,
      Math.min(innerWidth - 25, rect.left + rect.width * 0.55),
    );
    const y = Math.max(
      12,
      Math.min(innerHeight - 25, rect.top + rect.height * 0.5),
    );
    const pointer = document.querySelector<HTMLElement>(".demo-pointer");
    if (pointer) {
      pointer.style.setProperty("--pointer-x", `${x}px`);
      pointer.style.setProperty("--pointer-y", `${y}px`);
      pointer.dataset.action = label;
      const caption = pointer.querySelector("span");
      if (caption) {
        caption.textContent = label;
        caption.style.left = `${Math.min(17, innerWidth - x - caption.offsetWidth - 8)}px`;
      }
    }
    this.highlighted?.classList.remove("presentation-target");
    target.classList.add("presentation-target");
    this.highlighted = target;
    target.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: x,
        clientY: y,
      }),
    );
    await delay(this.reduced ? 70 : 600, this.signal);
    return target;
  }
  async click(selector: string, label: string) {
    const target = await this.move(selector, label);
    const pointer = document.querySelector(".demo-pointer");
    pointer?.classList.add("is-clicking");
    target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await delay(this.reduced ? 40 : 160, this.signal);
    target.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    target.click();
    pointer?.classList.remove("is-clicking");
    await delay(this.reduced ? 80 : 350, this.signal);
  }
  async type(selector: string, text: string) {
    const target = await this.move(selector, "Gõ yêu cầu");
    if (!(target instanceof HTMLTextAreaElement))
      throw new Error("Ô soạn tin chưa sẵn sàng.");
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )!.set!;
    setter.call(target, "");
    target.dispatchEvent(new Event("input", { bubbles: true }));
    const parts = this.reduced ? [text] : [...text];
    let value = "";
    for (const part of parts) {
      this.signal.throwIfAborted();
      target.dispatchEvent(
        new KeyboardEvent("keydown", { key: part, bubbles: true }),
      );
      value += part;
      setter.call(target, value);
      target.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          data: part,
          inputType: "insertText",
        }),
      );
      target.dispatchEvent(
        new KeyboardEvent("keyup", { key: part, bubbles: true }),
      );
      await delay(this.reduced ? 60 : 23, this.signal);
    }
  }
  async shortcut(
    selector: string,
    key: string,
    modifiers: { ctrlKey?: boolean; altKey?: boolean },
    label: string,
  ) {
    const target = await this.move(selector, label);
    const keycap = document.querySelector<HTMLElement>(".demo-keycap");
    if (keycap) {
      keycap.textContent = label;
      keycap.classList.add("visible");
    }
    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        ...modifiers,
        bubbles: true,
        cancelable: true,
      }),
    );
    target.dispatchEvent(
      new KeyboardEvent("keyup", { key, ...modifiers, bubbles: true }),
    );
    await delay(this.reduced ? 120 : 650, this.signal);
    keycap?.classList.remove("visible");
  }
  cleanup() {
    this.highlighted?.classList.remove("presentation-target");
    document.querySelector(".demo-pointer")?.classList.remove("is-clicking");
    document.querySelector(".demo-keycap")?.classList.remove("visible");
  }
}
