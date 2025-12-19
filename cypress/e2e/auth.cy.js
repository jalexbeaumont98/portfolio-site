// cypress/e2e/auth.cy.js

// Helper to generate a unique email so signup doesn't clash
function uniqueEmail() {
  const suffix = Date.now();
  return `cypress_user_${suffix}@example.com`;
}

describe('Authentication flow', () => {
  it('allows a user to sign up and then sign in', () => {
    const email = uniqueEmail();
    const password = 'Test1234!';
    const name = 'Cypress User';

    // 1) Go to signup page
    cy.visit('/signup');

    // 2) Fill signup form (match your actual field names/selectors)
    cy.get('[data-cy="signup-name"]').type(name);
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    //cy.get('input[name="confirmPassword"]').type(password); // if you have this

    cy.contains('button', /sign up/i).click();

    // 2.5) After signup, the app redirects to /login — log the user in
    cy.url().should('include', '/login');

    // Fill login form using the same credentials
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);

    cy.contains('button', /sign in/i).click();

    // 3) Expect to be redirected / logged in
    //    You might land on / or see nav reflect auth state.
    cy.url().should('match', /\/(home)?$/); // tweak if your route is different

    // Navbar check (adjust selectors/classes to your components)
    cy.get('nav').within(() => {
      cy.contains(name).should('exist'); // user name appears somewhere in nav
      cy.contains(/logout/i).should('exist');
    });

    // 4) Sign out via nav
    cy.contains(/logout/i).click();

    // 5) Sign back in with same credentials
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);

    cy.contains('button', /sign in/i).click();

    // 6) Confirm we're logged in again
    cy.get('nav').within(() => {
      cy.contains(name).should('exist');
      cy.contains(/logout/i).should('exist');
    });
  });
});