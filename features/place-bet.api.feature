@foo
Feature: Login Betson Website
  As a user
  I want to login to the application

  Scenario Outline: Login with a registered user
    Given I should register session info with registered users information
    Then I should get sporstbook token with session id
    Then I should get details for football events
    Then I should place a bet on first event
    Then I should get "E_BETTING_FUNDS_INSUFFICIENT" as error message
