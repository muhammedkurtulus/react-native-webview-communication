import * as Print from 'expo-print';
import React from 'react';
import { Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';


export default function App() {

  // Define the HTML content with window functions
  const localHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Webview Page with Window Functions</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 0;
          }
          h1 {
              text-align: center;
          }
          button {
              margin: 10px;
              padding: 10px 20px;
              font-size: 16px;
          }
      </style>
      <script>
          sendPostMessage = function (message) {
              window.ReactNativeWebView.postMessage(message);
              return true;
          };
      </script>
    </head>

    <body>
    <h1>WebView with Window Functions</h1>
      <button onclick="print()">Print</button>
      <button onclick="sendPostMessage('message')">Send Post Message</button>
    </body>
    </html>
  `;

  // If we cannot directly modify the WebView source, we can inject JavaScript code into the WebView.
  const injectedJS = `
    // Override window.print to trigger a message to React Native
    window.print = function () {
      const content = document.documentElement.outerHTML; 
      window.ReactNativeWebView.postMessage(content);
    };

    true;
  `;

  // Function to handle print
  const handlePrint = async (content: any) => {
    // Trigger the print functionality with expo-print using the WebView content
    await Print.printAsync({ html: content });
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        style={{ flex: 1 }}
        source={{ html: localHtmlContent }}
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          const message = event.nativeEvent.data;

          // Handle different messages received from the HTML page
          if (message === "message") {
            Alert.alert(message);
          }
          else if (message) {
            handlePrint(message);
          }

        }}
      />
    </View>
  );
}
