# Js client for fr-cable server

It's small js client, compable with fr-cable-server.

!!!WARNING!!! The project is at a very early stage of development, it can be used, but there is no guarantee that it works as you expect and that I will not abandon it tomorrow


## Installation

        npm i fr-cable-js-client

## Usage

        import FrCableClient from "fr-cable-js-client"

        FrCableClient.connect("localhost:2357")
        .then((connection) => {
          connection.subscribe({
            channel: 'ChatChannel',
            room: 'specific_room'
          })
          .then((subscription) => {
            subscription.onMessage = (message) => {
              console.log(`Received: ${message}`)
            }

            subscription.broadcast("Hello from fr cable")
          })
          .catch((error) => {
            console.log(error)
            //{code: *same int*, message: *same string*}
          })
        })
        .catch((error) => {
          console.log(error)
          //{code: *same int*, message: *same string*}
        })


## Contributing

No needed to contribute now


## License
MIT