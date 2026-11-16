import { test, expect } from '@playwright/test';

function luminance(rgb) {
  const channels = rgb.map((value) => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

test('alert text contrast is at least 4.5 in both themes', async ({ page }) => {
  await page.goto('/');

  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, value) => {
      element.dataset.theme = value;
    }, theme);

    for (const variant of ['info', 'success', 'warning', 'danger']) {
      const alert = page.locator(`.alerts-stack .ui-alert--${variant}`);

      const colors = await alert.evaluate((element) => {
        const styles = getComputedStyle(element);
        const parse = (value) => value.match(/\d+/g).slice(0, 3).map(Number);

        return {
          text: parse(styles.color),
          background: parse(styles.backgroundColor)
        };
      });

      expect(
        contrastRatio(colors.text, colors.background),
        `${variant} in ${theme}`
      ).toBeGreaterThanOrEqual(4.5);
    }
  }
});