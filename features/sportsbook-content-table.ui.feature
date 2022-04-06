@foo
Feature: Validate sportbook content table behaviour
  As a user
  I want to navigate sportsbook section and validate event table load behaviour


  Background: Navigation
    Given Navigate to the betson website

  Scenario Outline: Validate new content loaded in event list after scroll down
    When I click to the sportsbook link
    Then I should see sportsbook quicklink menu
    When I should navigate to "Football" in "Turkey" in "All Turkey"
    Then I should see content table
    When I scroll down to the bottom
    Then I should see content table
    Then I should see new content is loaded
