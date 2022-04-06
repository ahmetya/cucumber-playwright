@foo
Feature: Login Betson Website
  As a registered user
  I want to login to the application successfully and check if balance information is displayed to validate a successful login

  Background: Navigation
    Given Navigate to the betson website

  Scenario Outline: Login with a predefined user
    When I click to the login button
    And I enter email "dailytester@protonmail.com" and password "Kartal1903@bjk"
    And I click to the login submit button
    Then I should see my balance

