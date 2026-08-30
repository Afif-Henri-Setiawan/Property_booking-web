// @ts-ignore
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Snap Client
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'dummy_client_key'
});
