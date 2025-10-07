import os
from playwright.sync_api import sync_playwright, Page, expect
import requests

def register_user(email, password, name):
    """Registers a new user via API."""
    try:
        response = requests.post(
            "http://localhost:3000/api/auth/register",
            json={"email": email, "password": password, "name": name},
        )
        response.raise_for_status()
        print(f"User {email} registered successfully.")
        return response.json()
    except requests.exceptions.HTTPError as err:
        if "already exists" in err.response.text:
            print(f"User {email} already exists. Skipping registration.")
            return None
        else:
            raise err

def run_test(page: Page, email, password):
    """
    This test logs in, navigates to the teams page, and verifies the fix.
    """
    # 1. Arrange: Log in to the application.
    page.goto("http://localhost:3000/login")
    page.fill("input#email", email)
    page.fill("input#password", password)
    page.click("button[type='submit']")

    # Wait for the URL to change to the inbox page, indicating successful login and redirect.
    page.wait_for_url("http://localhost:3000/lndev-ui/inbox")

    # 2. Act: Navigate directly to the teams page.
    page.goto("http://localhost:3000/lndev-ui/teams")

    # Find and click the "Add Team" button using a more specific selector.
    add_team_button = page.locator("div.flex.items-center.gap-2 > button:has-text('Add Team')")
    expect(add_team_button).to_be_visible()
    add_team_button.click()

    # The modal should be visible now.
    expect(page.get_by_role("dialog")).to_be_visible()
    expect(page.get_by_role("heading", name="Create Team")).to_be_visible()

    # Fill in the team name
    page.fill("input[name='name']", "My New Team")

    # 3. Act: Add a member to the team.
    # The user 'leonel.ngoya' should exist from the mock data.
    page.get_by_text("leonel.ngoya").click()

    # 4. Assert: Check that the member was added to the selection.
    selected_member = page.locator(".mt-2.flex.flex-wrap.gap-2")
    expect(selected_member).to_contain_text("leonel.ngoya")

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot taken successfully.")

def main():
    # Generate unique credentials for this test run.
    email = "test.user@example.com"
    password = "password123"
    name = "Test User"

    # Register the user.
    register_user(email, password, name)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_test(page, email, password)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()