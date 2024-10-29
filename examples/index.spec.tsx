import { test, expect } from "@playwright/test";

test("counter", async ({ page }) => {
  await page.goto("/examples/Counter.tsx");

  const button = page.locator("button").first();
  const display = page.locator("h1").first();

  await button.click();

  await expect(display).toHaveText("1");

  await button.click();

  await expect(display).toHaveText("2");
});

test("counter-persistent", async ({ page }) => {
  await page.goto("/examples/CounterPersistent.tsx");

  const button = page.locator("button").first();
  const display = page.locator("h1").first();

  await button.click();

  await expect(display).toHaveText("1");

  await page.reload();

  await button.click();

  await expect(display).toHaveText("2");
});

test("monolith-store", async ({ page }) => {
  await page.goto("/examples/MonolithStore");

  const btnX = page.locator("button").nth(0);
  const btnY = page.locator("button").nth(1);
  const total = page.locator("h3").nth(1);

  await btnX.click();
  await btnY.click();

  await expect(btnX).toContainText("2");
  await expect(btnY).toContainText("3");
  await expect(total).toContainText("5");
});

test("todo-app", async ({ page }) => {
  await page.goto("/examples/TodoApp");

  const add = page.locator("button", { hasText: "+" });
  const input = page.locator("input[value]");
  const title = page.locator("h3");
  const todoToggle = page.locator("input[type=checkbox]");
  const deleteCompleted = page.locator(
    "button[title='Delete all completed todos']"
  );
  const deleteCurrent = page.locator("button[title='Delete current todo']");
  const filter = page.locator("select");

  await expect(title).toContainText("1 todos left");

  await input.fill("Hello");

  await expect(input).toHaveValue("Hello");

  await add.click();
  await add.click();

  await expect(input).toHaveCount(3);

  await expect(title).toContainText("3 todos left");

  await todoToggle.nth(2).click();

  await expect(title).toContainText("2 todos left");

  await filter.selectOption({ label: "Completed" });

  await expect(input).toHaveCount(1);

  await filter.selectOption({ label: "Active" });

  await expect(input).toHaveCount(2);

  await filter.selectOption({ label: "All" });

  await expect(input).toHaveCount(3);

  await todoToggle.first().click();

  await expect(title).toContainText("0 todos left");
  await expect(todoToggle.first()).toBeEnabled();

  await deleteCurrent.first().click();

  await expect(input).toHaveCount(2);

  await deleteCompleted.click();

  await expect(todoToggle.first()).toBeDisabled();
  await expect(input).toHaveCount(0);
});
