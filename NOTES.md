# Notes - 30.07.2025

- The core functionality is more or less done, except for the bidding feature. Users are able to create, view, update and delete ads.

- The front-end needs a lot of minor and some major changes.

- Back-end is ok for now, I will need to implement support for cookies for more secure auth in front-end. Fetching tokens from LocalStorage is not secure at all.

# Notes 13.08.2025

1. Finish functionality for /my-bids
2. Do the same for /my-item-details
3. Add UI for if the item is currently in bidding mode or if a bid has been accepted for it. If a bid has been accepted, it should not be marked as sold until the owner does it manually (even if a bid has been accepted something may happen leading to the item not being sold regardless).


# Further plans

- Clean up front-end for current components.
- Finalize register/login front-end.
- Change design of itemDetails (for item owners). I want to make a standalone component for details for items that a user owns. Meaning, not to use the same components for both features. Will require more front-end work, but will make auth easier and cleaner and will allow me to customize the item details for item owners.
- Probably refactor much of the code when the todos above are done.
- Transition all CSS styling to component based styling. index.css is too large.
