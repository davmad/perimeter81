import axios from "axios";

const stripeTokenUrl = "https://api.stripe.com/v1/tokens";
const stripeChargeUrl = "https://api.stripe.com/v1/charges";

const applyStripeApi = async (options: any): Promise<any> => {
    try {
        const response = await axios(options);
        if (200 == response.status && response.data) {
            // console.log(response.data);
            return response.data;
        } else {
            throw new Error("Response status not 200 or no data in response");
        }
    } catch(err) {
        throw new Error(`Error on request: '${err.message}'.`);
    }
}

const prepareStripeCardTokenOptions = (card: ICard) => {
    return {
        "url": stripeTokenUrl, 
        "method": 'POST', 
        "data": `card[number]=${card.number}&card[exp_month]=${card.exp_month}&card[exp_year]=${card.exp_year}&card[cvc]=${card.cvc}`, 
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}` || "Bearer MY_STRIPE_SECRET_KEY"
        }
    };
}

const prepareStripeChargeOptions = (cardToken: string, order: IOrder) => {
    return {
        "url": stripeChargeUrl, 
        "method": 'POST', 
        "data": `amount=${100 * order.total}&currency=usd&source=${cardToken}&description=pizza order`, 
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}` || "Bearer MY_STRIPE_SECRET_KEY"
        }
    };
}

const stripeAcceptPayment = async (card: ICard, order: IOrder): Promise<string> => {
    try {
        const ccTokenResponse = await applyStripeApi(prepareStripeCardTokenOptions(card));
        const ccChargeResponse = await applyStripeApi(prepareStripeChargeOptions(ccTokenResponse.id, order));
        return ( ccChargeResponse.status ? "success" : "failed" );
    } catch(err) {
        throw new Error(`Error on request: '${err.message}'.`);
    }
};

export default stripeAcceptPayment;