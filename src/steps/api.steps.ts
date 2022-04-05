import { ICustomWorld } from '../support/custom-world';
import { parseApiResponse } from '../utils/genericHelper';
import expect from 'expect';
import { Given, Then } from '@cucumber/cucumber';
import { AxiosResponse } from 'axios';

let _sessionToken: string;
let _customerId: string;
let _sportsbooktoken: string;
let _id: string;
let _odds: number;
let _couponId: string;

Given(
  'I should register session info with registered users information',
  async function (this: ICustomWorld) {
    const response: AxiosResponse | undefined = await this.server
      ?.post(
        'v1/single-sign-on-sessions/',
        '{"type":"up","loginSource":"Web","iovationBlackBox":"","username":"dailytester@protonmail.com","password":"Kartal1903@bjk","shouldRememberUser":false}',
        {
          headers: {
            brandid: '00b32971-a1d3-48ad-abeb-d8a8368e58a6',
          },
        },
      )
      .then((response) => {
        const responseData = parseApiResponse(response);
        _sessionToken = responseData.sessionToken;
        _customerId = responseData.customerId;
        // console.log(_customerId);
        // console.log(_sessionToken);
        return response;
      });
    expect(response).toBeDefined();
    expect(_customerId).toBeDefined();
  },
);

Then('I should get balance information', async function (this: ICustomWorld) {
  const response: AxiosResponse | undefined = await this.server
    ?.get('v2/wallet/balance/', {
      headers: {
        sessiontoken: _sessionToken,
      },
    })
    .then((response) => {
      return response;
    });
  expect(response).toBeDefined();
});

Then('I should get sporstbook token with session id', async function (this: ICustomWorld) {
  const url = 'sb/v2/sportsbookgames/betsson/' + _customerId;
  // console.log(url);
  const response: AxiosResponse | undefined = await this.server
    ?.get(url, {
      headers: {
        sessiontoken: _sessionToken,
      },
    })
    .then((response) => {
      const responseData = parseApiResponse(response);
      _sportsbooktoken = responseData.token;
      // console.log(_sportsbooktoken);
      return response;
    });
  expect(response).toBeDefined();
});

Then('I should get details for football events', async function () {
  const url =
    'sb/v1/widgets/carousel/v2?slug=football/turkey/turkey-super-lig&categoryIds=1&regionIds=27&subcategoryIds=33';
  // console.log(url);
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

      // console.log(_id);
      // console.log(_odds);
      return response;
    });
  expect(response).toBeDefined();
});

Then('I should place a bet on first event', async function (this: ICustomWorld) {
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
      // console.log(_couponId);
      // console.log(response);
      return response;
    });
  expect(response).toBeDefined();
  expect(_customerId).toBeDefined();
});

Then(
  'I should get {string} as error message',
  async function (this: ICustomWorld, errorMessage: string) {
    const url = 'sb/v2/coupons/' + _couponId;
    // console.log(url);
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
    // expect(response).toContain(errorMessage);
    // console.log(errorMessage);
    // console.log(response?.data);
    expect(response?.data[0].code).toContain(errorMessage);
  },
);
