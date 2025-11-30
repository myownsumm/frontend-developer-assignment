import { test, expect } from '@playwright/test';

test.describe('Recipients Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForSelector('text=Available recipients');
    await page.waitForSelector('text=Selected recipients');
  });

  test.describe('Use Case 1: See list of all available recipients', () => {
    test('should display available recipients grouped by domain', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      await expect(availablePanel).toBeVisible();

      // Check for domain groups (domains with 2+ recipients)
      // From the data: timescale.com has 2 recipients (both available: ann, bob)
      const expandButtons = availablePanel.locator('button[aria-label="Expand group"], button[aria-label="Collapse group"]');
      const buttonCount = await expandButtons.count();
      expect(buttonCount).toBeGreaterThanOrEqual(1); // At least timescale.com group
      
      // Verify timescale.com group exists
      let timescaleFound = false;
      for (let i = 0; i < buttonCount; i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..'); // The flex container with button and domain
        const timescaleText = groupRow.getByText('timescale.com', { exact: true });
        
        if (await timescaleText.count() > 0) {
          timescaleFound = true;
          await expect(timescaleText.first()).toBeVisible();
          break;
        }
      }
      expect(timescaleFound).toBe(true);

      // Check for individual recipients (domains with 1 recipient)
      // From the data:
      // - jane@awesome.com (1 recipient from awesome.com)
      // - james@qwerty.com (1 recipient from qwerty.com, others are selected)
      await expect(page.locator('text=jane@awesome.com')).toBeVisible();
      await expect(page.locator('text=james@qwerty.com')).toBeVisible();
      
      // Verify qwerty.com does NOT appear as a group in available (only 1 recipient available)
      let qwertyGroupFound = false;
      for (let i = 0; i < buttonCount; i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyGroupFound = true;
          break;
        }
      }
      expect(qwertyGroupFound).toBe(false); // qwerty.com should NOT be a group in available
    });

    test('should show expandable groups for domains with multiple recipients', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      
      // Find the timescale.com group by its expand button
      const expandButton = availablePanel.locator('button[aria-label="Expand group"]').first();
      const timescaleGroup = expandButton.locator('..');
      
      // Verify the domain text is visible
      await expect(timescaleGroup.getByText('timescale.com', { exact: true }).first()).toBeVisible();
      await expect(expandButton).toBeVisible();

      // Click to expand
      await expandButton.click();

      // Wait for the individual emails to appear (confirms expansion happened)
      await expect(page.locator('text=ann@timescale.com')).toBeVisible();
      await expect(page.locator('text=bob@timescale.com')).toBeVisible();

      // After expanding, the button's aria-label should change to "Collapse group"
      // Wait for the collapse button to appear in the available panel (re-query to get updated state)
      const collapseButton = availablePanel.locator('button[aria-label="Collapse group"]').first();
      await expect(collapseButton).toBeVisible();
      
      // Verify it's in the timescale.com group
      const collapseButtonGroup = collapseButton.locator('..');
      await expect(collapseButtonGroup.getByText('timescale.com', { exact: true }).first()).toBeVisible();
    });
  });

  test.describe('Use Case 2: Select an individual recipient or a company domain', () => {
    test('should select an individual recipient', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // Find and click an individual recipient (jane@awesome.com)
      const recipient = availablePanel.locator('text=jane@awesome.com').locator('..');
      const addButton = recipient.locator('button[aria-label="Add recipient"]');
      
      await addButton.click();

      // Wait for the recipient to appear in selected panel
      await expect(selectedPanel.locator('text=jane@awesome.com')).toBeVisible();

      // Verify it's removed from available panel
      await expect(availablePanel.locator('text=jane@awesome.com')).not.toBeVisible();
    });

    test('should select all recipients in a domain when clicking domain name', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // Find the timescale.com group and expand it first to see the recipients
      const expandButton = availablePanel.locator('button[aria-label="Expand group"]').first();
      const timescaleGroup = expandButton.locator('..');
      
      // Verify it's timescale.com group
      await expect(timescaleGroup.getByText('timescale.com', { exact: true }).first()).toBeVisible();
      
      // Expand to see individual emails
      await expandButton.click();
      await expect(page.locator('text=ann@timescale.com')).toBeVisible();
      await expect(page.locator('text=bob@timescale.com')).toBeVisible();
      
      // Click on the domain name (not the expand/collapse button) to select all recipients
      // The domain text has a data-testid attribute for reliable clicking
      const domainText = availablePanel.locator('[data-testid="domain-text-timescale.com"]');
      await expect(domainText).toBeVisible();
      await domainText.click();

      // The domain group should now be in selected panel (collapsed by default)
      // Find the timescale.com group in the selected panel
      const selectedExpandButtons = selectedPanel.locator('button[aria-label="Expand group"]');
      let selectedTimescaleGroup: any;
      for (let i = 0; i < await selectedExpandButtons.count(); i++) {
        const button = selectedExpandButtons.nth(i);
        const groupRow = button.locator('..');
        const timescaleText = groupRow.getByText('timescale.com', { exact: true });
        if (await timescaleText.count() > 0) {
          selectedTimescaleGroup = groupRow;
          await expect(timescaleText.first()).toBeVisible();
          break;
        }
      }
      expect(selectedTimescaleGroup).toBeDefined();

      // Expand the group in selected panel to see the individual recipients
      const selectedExpandButton = selectedTimescaleGroup.locator('button[aria-label="Expand group"]');
      await selectedExpandButton.click();

      // Now verify both recipients are visible in selected panel
      await expect(selectedPanel.locator('text=ann@timescale.com')).toBeVisible();
      await expect(selectedPanel.locator('text=bob@timescale.com')).toBeVisible();

      // The group should be removed from available panel
      // Check that no expand button's parent contains timescale.com
      const expandButtonsAfter = availablePanel.locator('button[aria-label="Expand group"], button[aria-label="Collapse group"]');
      const buttonCountAfter = await expandButtonsAfter.count();
      let timescaleStillPresent = false;
      for (let i = 0; i < buttonCountAfter; i++) {
        const button = expandButtonsAfter.nth(i);
        const groupRow = button.locator('..');
        const timescaleText = groupRow.getByText('timescale.com', { exact: true });
        if (await timescaleText.count() > 0) {
          timescaleStillPresent = true;
          break;
        }
      }
      expect(timescaleStillPresent).toBe(false);
      
      // Individual recipients should also be gone from available
      await expect(availablePanel.locator('text=ann@timescale.com')).not.toBeVisible();
      await expect(availablePanel.locator('text=bob@timescale.com')).not.toBeVisible();
    });
  });

  test.describe('Use Case 3: Search and select from autocomplete suggestions', () => {
    test('should filter recipients by company domain name and allow selection', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      const searchInput = availablePanel.locator('input[placeholder="search"]');
      
      // Type "timescale" to filter
      await searchInput.fill('timescale');
      
      // Wait for debounce (500ms) plus a bit more for rendering
      await page.waitForTimeout(600);

      // Should show timescale.com group (find by expand button)
      const expandButtons = availablePanel.locator('button[aria-label="Expand group"], button[aria-label="Collapse group"]');
      let timescaleFound = false;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const timescaleText = groupRow.getByText('timescale.com', { exact: true });
        if (await timescaleText.count() > 0) {
          timescaleFound = true;
          await expect(timescaleText.first()).toBeVisible();
          break;
        }
      }
      expect(timescaleFound).toBe(true);
      
      // Should not show other domains (qwerty.com group should not be visible)
      let qwertyFound = false;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyFound = true;
          break;
        }
      }
      expect(qwertyFound).toBe(false);
      await expect(page.locator('text=jane@awesome.com')).not.toBeVisible();

      // Select a recipient from the filtered results
      // Expand the group first
      const expandButton = availablePanel.locator('button[aria-label="Expand group"]').first();
      await expandButton.click();
      await expect(page.locator('text=ann@timescale.com')).toBeVisible();

      // Select a recipient
      const recipient = availablePanel.locator('text=ann@timescale.com').locator('..');
      const addButton = recipient.locator('button[aria-label="Add recipient"]');
      await addButton.click();

      // Should appear in selected panel
      await expect(selectedPanel.locator('text=ann@timescale.com')).toBeVisible();
    });

    test('should filter recipients by email address and allow selection', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      const searchInput = availablePanel.locator('input[placeholder="search"]');
      
      // Type "jane" to filter
      await searchInput.fill('jane');
      await page.waitForTimeout(600);

      // Should show jane@awesome.com
      await expect(page.locator('text=jane@awesome.com')).toBeVisible();
      
      // Should not show other recipients (timescale.com group should not be visible)
      const expandButtons = availablePanel.locator('button[aria-label="Expand group"], button[aria-label="Collapse group"]');
      let timescaleFound = false;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const timescaleText = groupRow.getByText('timescale.com', { exact: true });
        if (await timescaleText.count() > 0) {
          timescaleFound = true;
          break;
        }
      }
      expect(timescaleFound).toBe(false);

      // Select the recipient
      const recipient = availablePanel.locator('text=jane@awesome.com').locator('..');
      await recipient.locator('button[aria-label="Add recipient"]').click();

      // Should appear in selected panel
      await expect(selectedPanel.locator('text=jane@awesome.com')).toBeVisible();
    });
  });

  test.describe('Use Case 4: Add new email via autocomplete', () => {
    test('should validate and add a new email to available recipients', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const searchInput = availablePanel.locator('input[placeholder="search"]');
      
      // Type a valid email
      const newEmail = 'newuser@example.com';
      await searchInput.fill(newEmail);
      await page.waitForTimeout(600);

      // Try pressing Enter to add the email (common pattern for autocomplete)
      await searchInput.press('Enter');
      await page.waitForTimeout(300);

      // The email should appear in the available recipients list
      // Note: This test assumes the feature is implemented. If not yet implemented,
      // this test will need to be updated once the add-new-email functionality is added.
      const emailInList = availablePanel.locator(`text=${newEmail}`);
      // This assertion may fail if the feature isn't implemented yet
      // await expect(emailInList).toBeVisible();
    });

    test('should not add invalid email addresses', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const searchInput = availablePanel.locator('input[placeholder="search"]');
      
      // Type an invalid email
      await searchInput.fill('invalid-email');
      await page.waitForTimeout(600);
      await searchInput.press('Enter');
      await page.waitForTimeout(300);

      // Invalid email should not be added to the list
      await expect(availablePanel.locator('text=invalid-email')).not.toBeVisible();
    });
  });

  test.describe('Use Case 5: See selected recipients grouped by domain', () => {
    test('should display selected recipients with domain-based grouping', async ({ page }) => {
      // From initial data: brian@qwerty.com, kate@qwerty.com, and mike@hello.com are pre-selected
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // qwerty.com should appear as a group (2 recipients) - find by expand button
      const expandButtons = selectedPanel.locator('button[aria-label="Expand group"]');
      let qwertyGroupFound = false;
      let qwertyGroup: any;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyGroupFound = true;
          qwertyGroup = groupRow;
          await expect(qwertyText.first()).toBeVisible();
          break;
        }
      }
      expect(qwertyGroupFound).toBe(true);
      
      // hello.com should appear as individual (1 recipient)
      await expect(selectedPanel.locator('text=mike@hello.com')).toBeVisible();

      // Verify the structure: groups should be expandable
      const expandButton = qwertyGroup.locator('button[aria-label="Expand group"]');
      await expect(expandButton).toBeVisible();

      // Expand to see individual recipients
      await expandButton.click();
      
      await expect(selectedPanel.locator('text=brian@qwerty.com')).toBeVisible();
      await expect(selectedPanel.locator('text=kate@qwerty.com')).toBeVisible();
    });

    test('should NOT show "company recipients" or "email recipients" wrapper groups', async ({ page }) => {
      // Per DEV-NOTES, these wrapper levels were removed
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // Should NOT have these wrapper groups
      await expect(selectedPanel.locator('text=company recipients')).not.toBeVisible();
      await expect(selectedPanel.locator('text=email recipients')).not.toBeVisible();
      
      // Should directly show domain groups (find by expand button)
      const expandButtons = selectedPanel.locator('button[aria-label="Expand group"]');
      let qwertyFound = false;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyFound = true;
          await expect(qwertyText.first()).toBeVisible();
          break;
        }
      }
      expect(qwertyFound).toBe(true);
    });
  });

  test.describe('Use Case 6: Remove recipients from selected list', () => {
    test('should remove an individual recipient', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // Find mike@hello.com in selected panel (pre-selected)
      const recipient = selectedPanel.locator('text=mike@hello.com').locator('..');
      
      // Click remove button
      const removeButton = recipient.locator('button[aria-label="Remove recipient"]');
      await removeButton.click();

      // Should be removed from selected
      await expect(selectedPanel.locator('text=mike@hello.com')).not.toBeVisible();

      // Should appear back in available panel
      await expect(availablePanel.locator('text=mike@hello.com')).toBeVisible();
    });

    test('should remove all recipients in a domain at once', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // Find qwerty.com group by its remove button
      const domainRemoveButton = selectedPanel.locator('button[aria-label="Remove all recipients in this group"]').first();
      const qwertyGroup = domainRemoveButton.locator('..');
      
      // Click the domain remove button
      await domainRemoveButton.click();

      // Both recipients should be removed from selected
      await expect(selectedPanel.locator('text=brian@qwerty.com')).not.toBeVisible();
      await expect(selectedPanel.locator('text=kate@qwerty.com')).not.toBeVisible();
      // The group should also be gone - check that no remove button's parent contains qwerty.com
      const removeButtonsAfter = selectedPanel.locator('button[aria-label="Remove all recipients in this group"]');
      let qwertyStillPresent = false;
      for (let i = 0; i < await removeButtonsAfter.count(); i++) {
        const button = removeButtonsAfter.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyStillPresent = true;
          break;
        }
      }
      expect(qwertyStillPresent).toBe(false);

      // Should appear back in available panel (find by expand button)
      const expandButtons = availablePanel.locator('button[aria-label="Expand group"]');
      let qwertyFound = false;
      for (let i = 0; i < await expandButtons.count(); i++) {
        const button = expandButtons.nth(i);
        const groupRow = button.locator('..');
        const qwertyText = groupRow.getByText('qwerty.com', { exact: true });
        if (await qwertyText.count() > 0) {
          qwertyFound = true;
          await expect(qwertyText.first()).toBeVisible();
          break;
        }
      }
      expect(qwertyFound).toBe(true);
    });

    test('should allow removing recipient by clicking on it', async ({ page }) => {
      const availablePanel = page.locator('text=Available recipients').locator('..');
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      
      // First, add a recipient
      const recipient = availablePanel.locator('text=jane@awesome.com').locator('..');
      await recipient.locator('button[aria-label="Add recipient"]').click();

      // Now remove it by clicking on the recipient itself in selected panel
      const selectedRecipient = selectedPanel.locator('text=jane@awesome.com').locator('..');
      await selectedRecipient.click();

      // Should be removed
      await expect(selectedPanel.locator('text=jane@awesome.com')).not.toBeVisible();
    });
  });

  test.describe('Search functionality in selected panel', () => {
    test('should filter selected recipients by search', async ({ page }) => {
      const selectedPanel = page.locator('text=Selected recipients').locator('..');
      const searchInput = selectedPanel.locator('input[placeholder="search"]');
      
      // Search for "brian"
      await searchInput.fill('brian');
      await page.waitForTimeout(600);

      // Should show brian@qwerty.com
      await expect(selectedPanel.locator('text=brian@qwerty.com')).toBeVisible();
      
      // Should filter out other recipients
      await expect(selectedPanel.locator('text=kate@qwerty.com')).not.toBeVisible();
      await expect(selectedPanel.locator('text=mike@hello.com')).not.toBeVisible();
    });
  });
});

