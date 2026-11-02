# AI Foodsale APP

This is a full stack application for small scale sellers and homesteads (think homestead dairies, artisian cheesemakers, BBQ joints, bistros, garden to table restaurants) that allows them to sell their products to the public. The app features 2 roles: sellers and buyers.

Sellers with their admin panel can easily list their products (and services) for sale, update and schedule their availability, provide additional information per product, show behind the scenes of making and manage reservations of tables and partial products.

Buyers can easily browse all the products (which are displayed in a very intuitive and clean form), read and perhaps even watch more about them, buy, book tables and contact the sellers.

It's basically something a bit of an e-commerce platform but geared completely towards small scale local sellers and homesteads that specilize in their own high quiality products that deserve not to be mixed with the ordinary and anonymous products and services of the global platforms. That, connected with a simple and intiutive option of tables managing software for restaurant-like places (like bistors or BBQ joints).

### Tech stack

FE: newest Angular with TS and SCSS, Tailwind
Build engine: to be decided, basically the simplest, best documented and fastest possible (perhaps vite?)

BE: NestJS with TS
DB: PostgreSQL

Use docker for contenerization and ability to easily populate the DB and run tests on DB without the risk of wiping away real important data.

### Coding style and guideline

Use standard best practices for software development. Components should be trivial to understand without much logic happening inside.
Services should hold the logic. Simple and clear functions should be used a building blocks of logic, so that the services use clearly named functions and specific implementations can be inspected inside functions if needed. Functions should be pure if they can be and if they're not it should be clear they're not (clearly typed) so that the errors can be caught and accounted to. Every piece of logic should be short and clear enough that a tired software engineer should be easily able to inspect it and understand it. At the same time, reading code shouldn't require understanding all the implementation logic at once, since functions' names should be descriptive of what they do.
Every function with logic should have it test (or multiple if needed) and so only the logic itself should be tested, NOT the implementation.
We DO NOT test UI in the unit tests, unless there's is a good reason for that (e.g test buttons appear when we click the 'display buttons' button etc.).
Every unit test should be straightforward and trivial to understand. No logic inside unit tests. Clarity above performance (unless the perormance loss is considerable).

Unit tests for testing units of logic (generally functions) in the app. They make sure that each function does indeed what is says reliably.
E2E test with circleCI for testing workflows and user's behaviour. They make sure that basic and common workflows stay stable and working.

### Before any change

Make sure you have a clear picture of the logic needed in place and write tests that test exactly for the kind of logic we need. Tests that can fail only if the logic is wrong and that succeed only based on that logic working. If a test can fail despite the app technically working as it should, such test is useless and shouldn't be there at all.
