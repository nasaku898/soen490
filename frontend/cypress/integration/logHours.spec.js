/// <reference types="cypress" />

describe('CreateBusinessAccount feature e2e test', () => {
    const email = 'employee@gmail.com';
    const startDate = '2021-10-22';
    const endDate = '2021-10-25';
    const hoursWorked = '40';
    const paidAmount = '500';
  
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should render', () => {
      cy.visit('/employees');
      cy.get('#LogHours-Grid').should('exist');
    });
  
    // Test user story: #31. As a business user, I want to log hours
    it('Should log hours for one employee', () => {
      cy.intercept(
        {
          method: 'POST',
          url: '/logHours',
        },
        { fixture: 'pay.json', statusCode: 201 }
      ).as('logHoursAPI');

      cy.intercept('GET', '/accounts/allEmployees', (req) => {
          req.reply({
              statusCode: 200,
              fixture: 'allEmployees.json'
          })
      })
  
      cy.visit('/employees');
  
      cy.get('input[name=email]').type(email + '{downarrow}{enter}');
      cy.get('input[name=startDate]').type(startDate);
      cy.get('input[name=endDate]').type(endDate);
      cy.get('input[name=hoursWorked]').type(hoursWorked);
      cy.get('input[name=paidAmount]').type(paidAmount);
  
      cy.get('form').submit();
      cy.wait('@logHoursAPI').its('response.statusCode').should('eq', 201);
      cy.contains('Created succesfully');
    });
  });
  