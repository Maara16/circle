from playwright.sync_api import sync_playwright, Page, expect

def run_test(page: Page):
    """
    This test verifies that the empty state message is displayed when there are no teams.
    """
    # 1. Arrange: Go to the teams page.
    page.goto("http://localhost:3000/teams")

    # Take a screenshot for debugging purposes to see the initial state of the page.
    page.screenshot(path="jules-scratch/verification/debug_screenshot.png")

    # 2. Act: Wait for the page to load and the empty state to appear.
    # The text "No teams found" is a good indicator that the component has loaded.
    empty_state_text = page.get_by_text("No teams found. Get started by creating one.")

    # 3. Assert: Check that the empty state text is visible.
    expect(empty_state_text).to_be_visible()

    # 4. Screenshot: Capture the empty state for visual verification.
    page.screenshot(path="jules-scratch/verification/empty_state.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_test(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()