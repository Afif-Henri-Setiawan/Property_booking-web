import { snap } from './src/utils/midtrans';

async function testMidtrans() {
  try {
    const parameter = {
      transaction_details: {
        order_id: `TEST-${Date.now()}`,
        gross_amount: 10000
      },
      customer_details: {
        first_name: "juki 25",
        email: "juki180506@gmail.com"
      },
      item_details: [{
        id: "some-uuid",
        price: 10000,
        quantity: 1,
        name: "Test item"
      }]
    };

    console.log("Creating transaction...");
    const transaction = await snap.createTransaction(parameter);
    console.log("Success:", transaction);
  } catch (error: any) {
    console.error("Error generating transaction:");
    console.error(error);
  }
}

testMidtrans();
