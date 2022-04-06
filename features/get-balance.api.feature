@foo
Feature: Balance Api Validations and Schema
  As a user registered user
  I want to get balance information

  Scenario Outline: Make a get balance request ater receive session token with a registered user
    Given I should register session info and validate response schema
    Then I should get balance information