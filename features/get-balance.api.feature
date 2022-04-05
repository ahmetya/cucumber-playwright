@foo
Feature: Login Betson Website
  As a user
  I want to get balance information with a registered user credentials

  Scenario Outline: Login with a registered user and get balance info
    Given I should register session info with registered users information
    Then I should get balance information

