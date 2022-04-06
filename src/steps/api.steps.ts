import { ICustomWorld } from '../support/custom-world';
import { parseApiResponse } from '../utils/genericHelper';
import expect from 'expect';
import { Given, Then, When } from '@cucumber/cucumber';
import { AxiosResponse } from 'axios';

let _sessionToken: string;
let _customerId: string;
let _sportsbooktoken: string;
let _id: string;
let _odds: number;
let _couponId: string;

// Response of this request includes session token
// Session token is required for authentication for next requests
// Related with user data
Given(
  'I should register with username {string} and password {string} session info and validate response schema',
  async function (this: ICustomWorld, username: string, password: string) {
    const url = 'v1/single-sign-on-sessions/';
    const authRequest = {
      type: 'up',
      loginSource: 'Web',
      iovationBlackBox: '',
      username: username,
      password: password,
      shouldRememberUser: false,
    };
    const response: AxiosResponse | undefined = await this.server
      ?.post(url, authRequest)
      .then((response) => {
        const responseData = parseApiResponse(response);
        _sessionToken = responseData.sessionToken;
        _customerId = responseData.customerId;
        return response;
      });
    expect(response).toBeDefined();
    expect(_customerId).toBeDefined();
    const schemaValidation = validateSessionSchema(response);
    expect(schemaValidation).toBe(true);
  },
);

// Get request that returns balance information for token woner
Then('I should get balance information', async function (this: ICustomWorld) {
  const url = 'v2/wallet/balance/';
  const response: AxiosResponse | undefined = await this.server
    ?.get(url, {
      headers: {
        sessiontoken: _sessionToken,
      },
    })
    .then((response) => {
      return response;
    });
  expect(response).toBeDefined();
});

// This request returns sportsbook token which is required for betting operations
Then('I should get sporstbook token with session id', async function (this: ICustomWorld) {
  const url = 'sb/v2/sportsbookgames/betsson/' + _customerId;
  const response: AxiosResponse | undefined = await this.server
    ?.get(url, {
      headers: {
        sessiontoken: _sessionToken,
      },
    })
    .then((response) => {
      const responseData = parseApiResponse(response);
      _sportsbooktoken = responseData.token;
      return response;
    });
  expect(response).toBeDefined();
});

// All football events specific for a preselected league
Then('I should get details for football events', async function () {
  const url =
    'sb/v1/widgets/carousel/v2?slug=football/turkey/turkey-super-lig&categoryIds=1&regionIds=27&subcategoryIds=33';
  const response: AxiosResponse | undefined = await this.server
    ?.get(url, {
      headers: {
        sessiontoken: _sessionToken,
        sportsbooktoken: _sportsbooktoken,
      },
    })
    .then((response: AxiosResponse<unknown, unknown> | undefined) => {
      const responseData = parseApiResponse(response);
      _id = responseData.data.selections[0].id;
      _odds = responseData.data.selections[0].odds;
      return response;
    });
  expect(response).toBeDefined();
});

// Makes a fixed bet post requst for the first item that returns from event list
When('I should place a bet on first event', async function (this: ICustomWorld) {
  const requestrDataObj = {
    acceptOddsChanges: false,
    bets: [
      {
        stake: 5550,
        stakeForReview: 0,
        oddsFormat: 1,
        hasInconsistentBetSelectionPriceFormats: true,
        betSelections: [
          {
            marketSelectionId: _id,
            odds: _odds,
          },
        ],
      },
    ],
  };

  const response: AxiosResponse | undefined = await this.server
    ?.post('sb/v1/coupons', requestrDataObj, {
      headers: {
        sessiontoken: _sessionToken,
        sportsbooktoken: _sportsbooktoken,
      },
    })
    .then((response) => {
      const responseData = parseApiResponse(response);
      _couponId = responseData.referenceId;
      return response;
    });
  expect(response).toBeDefined();
  expect(_customerId).toBeDefined();
});

// This request validates a business flow which is related information with user
Then(
  'I should get {string} as error message',
  async function (this: ICustomWorld, errorMessage: string) {
    const url = 'sb/v2/coupons/' + _couponId;
    const response: AxiosResponse | undefined = await this.server
      ?.get(url, {
        headers: {
          sessiontoken: _sessionToken,
          sportsbooktoken: _sportsbooktoken,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response.data;
      });
    expect(response).toBeDefined();
    expect(response?.data[0].code).toContain(errorMessage);
  },
);

// schema validation with ajv library
function validateSessionSchema(data: AxiosResponse | undefined) {
  // options can be passed, e.g. {allErrors: true}
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Ajv = require('ajv');
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

  const singleSingOnSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    $id: 'http://example.com/example.json',
    type: 'object',
    default: {},
    required: [
      'sessionToken',
      'timeToLiveSeconds',
      'personalSessionLimitCheckPeriodSeconds',
      'customerId',
      'jurisdiction',
      'isFirstLogin',
      'hashedEmail',
    ],
    properties: {
      sessionToken: {
        $id: '#/properties/sessionToken',
        type: 'string',
      },
      timeToLiveSeconds: {
        $id: '#/properties/timeToLiveSeconds',
        type: 'number',
        title: 'The timeToLiveSeconds schema',
      },
      personalSessionLimitCheckPeriodSeconds: {
        $id: '#/properties/personalSessionLimitCheckPeriodSeconds',
        type: 'number',
      },
      customerId: {
        $id: '#/properties/customerId',
        type: 'string',
      },
      jurisdiction: {
        $id: '#/properties/jurisdiction',
        type: 'string',
      },
      isFirstLogin: {
        $id: '#/properties/isFirstLogin',
        type: 'boolean',
      },
      hashedEmail: {
        $id: '#/properties/hashedEmail',
        type: 'string',
      },
    },
    additionalProperties: true,
  };

  const validate = ajv.compile(singleSingOnSchema);
  const valid = validate(data);
  if (!valid) process.stderr.write(JSON.stringify(validate.errors));
  return valid;
}
