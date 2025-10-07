from playwright.sync_api import Page, expect

def test_team_creation_modal(page: Page):
    """
    This test verifies that a user can add members in the team creation modal
    without causing a crash.
    """
    # 1. Arrange: Go to the application's home page.
    # The dev server is running on the default Next.js port.
    page.goto("http://localhost:3000")

    # 2. Act: Open the team creation modal.
    # Based on the file structure, there should be a way to create a team.
    # I'll look for a button to open the modal.
    # Assuming there's a button with the text "Create Team" or similar.
    # Let's assume the button to create a team is available on the main page.
    # I will look for a button that opens the dialog.
    # A common pattern is to have a button in the header or a main content area.
    # I will assume there is a button with "Create Team" text.

    # Let's find a more robust way. I'll look at the `teams.tsx` file to see how the modal is triggered.
    # The user is on the teams page, so let's assume the url is /teams
    page.goto("http://localhost:3000/teams")

    # In `teams.tsx` there is a button "Add Team".
    page.get_by_role("button", name="Add Team").click()

    # The modal should be visible now.
    expect(page.get_by_role("dialog")).to_be_visible()
    expect(page.get_by_role("heading", name="Create Team")).to_be_visible()

    # 3. Act: Add a member to the team.
    # Find a user in the list and click to select them.
    # I'll pick the first user available.
    page.get_by_text("John Doe").click() # Assuming 'John Doe' is a user from mock data.

    # 4. Assert: Check that the member was added.
    # The selected member should appear in the list of selected members.
    expect(page.locator(".mt-2.flex.flex-wrap.gap-2")).to_contain_text("John Doe")

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")