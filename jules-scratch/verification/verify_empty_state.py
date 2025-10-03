import re
from playwright.sync_api import sync_playwright, Page, expect

import uuid

def verify_empty_state(page: Page):
    """
    This test verifies that the EmptyState component is displayed when a search
    on the issues page returns no results.
    """
    # 1. Arrange: Register a new user to ensure a clean state.
    unique_email = f"testuser_{uuid.uuid4()}@example.com"
    page.goto("http://localhost:3000/register")
    page.get_by_label("Name").fill("Test User")
    page.get_by_label("Email").fill(unique_email)
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Create account").click()

    # Wait for navigation to the main page after registration.
    expect(page).to_have_url(re.compile(r"http://localhost:3000/"))

    # Wait for the "Inbox" link to be visible, ensuring the page is loaded.
    inbox_link = page.get_by_role("link", name="Inbox")
    expect(inbox_link).to_be_visible()

    # 2. Act: Click the search button and enter a query with no results.
    page.get_by_role("button", name="Search").click()
    page.get_by_placeholder("Search issues...").fill("asdfghjkl")

    # 3. Assert: Verify that the EmptyState component is visible.
    empty_state_title = page.get_by_role("heading", name="No results found")
    expect(empty_state_title).to_be_visible()

    empty_state_description = page.get_by_text('Your search for "asdfghjkl" did not return any results.')
    expect(empty_state_description).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/empty-state-verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_empty_state(page)
        browser.close()

if __name__ == "__main__":
    main()