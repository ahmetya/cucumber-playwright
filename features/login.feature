@foo
Feature: Login Betson Website
  As a registered user
  I want to login to the application successfully.

  Background: Navigation
    Given Go to the betson website

  Scenario Outline: Login with a predefined user
    When I click to the login button
    And I enter username and password
    And I click to the login submit button
    Then I should see my balance

