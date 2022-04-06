@foo
Feature: Login Betson Website
  As a registered user without any funds in account
  I want to place bet on a sports event and receive appropriate error

  Scenario Outline: Create a football event bet request without sufficent balance and get the appropriate error
    Given I should register session info and validate response schema
    Then I should get sporstbook token with session id
    And I should get details for football events
    When I should place a bet on first event
    Then I should get "E_BETTING_FUNDS_INSUFFICIENT" as error message
