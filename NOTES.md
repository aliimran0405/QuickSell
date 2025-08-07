# Notes - 30.07.2025

- The core functionality is more or less done, except for the bidding feature. Users are able to create, view, update and delete ads.

- The front-end needs a lot of minor and some major changes.

- Back-end is ok for now, I will need to implement support for cookies for more secure auth in front-end. Fetching tokens from LocalStorage is not secure at all.


# Further plans

- Clean up front-end for current components.
- Finalize register/login front-end.
- Change design of itemDetails (for item owners). I want to make a standalone component for details for items that a user owns. Meaning, not to use the same components for both features. Will require more front-end work, but will make auth easier and cleaner and will allow me to customize the item details for item owners.
- Probably refactor much of the code when the todos above are done.
- Transition all CSS styling to component based styling. index.css is too large.
