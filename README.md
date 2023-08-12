# Workout Tracker

Workout Tracker is an open-source fitness application built using SvelteKit. It is designed to help users track their physical fitness activities. The application provides a simple and intuitive user interface, and it leverages the efficiency and flexibility of SvelteKit for a seamless user experience.

## Features
The current version is still in early development. Additional features will be added.

- **Workout Logging**: Easily log your workouts with custom exercises and durations.
- **Exercise Recommendations**: Get recommendations on reps and weight for workouts.
- **Exercise Descriptions**: Automatically generated information on your exercises.


## Usage
Workout Tracker is designed to be easy to use. For end-users who don't want to set up the environment on their local machine, you can directly use the app by visiting the hosted version at [workout.zack-bumm.com](https://workout.zack-bumm.com).

## Development

Alternatively to using the hosted version, Workout Tracker can be run locally for development purposes.

<details open>
<summary>
Pre-requisites
</summary> <br />
To be able to start development make sure that you have the following pre-requisites installed:

###

- Node.js v16 or above
- Docker
- Git
- openssl
</details>

<details open>
<summary>
Running Workout Tracker
</summary> <br />

###

1. Clone the repository and install dependencies:
```shell
git clone https://github.com/ChrGrb/workout-tracker && cd workout-tracker && yarn install
```

2. Setup environment variables
   1. Copy .env.temp to .env
    ```shell
    cp .env.temp .env
    ```
   2. Generate AUTH_SECRET and add it to .env
    ```shell
    openssl rand -base64 32
    ```
   3. Generate GitHub OAuth credentials
    Follow the instructions found here: https://authjs.dev/getting-started/oauth-tutorial?frameworks=next#2-configuring-oauth-provider
    > **Note**
    > The callback url for the github provider is `https://dev.workout-tracker.com:5173/auth/callback/github`
   4. *Optional* Setup OpenAI API key
    > **Note**
    > This is only necessary if you want to generate workout descriptions locally
    Follow instructions on how to retrieve your OpenAI API key here: https://platform.openai.com/docs/api-reference/authentication


3b. Run workout-tracker using Docker compose
> **Note**
> Alternatively you can also run the application using only docker
> You can skip step 3-5 in this case

1. Uncomment the web section in the docker-compose.yml file
2. Run the docker-compose instance including the web section
```shell
docker compose up --build -d
```

1. Run local infrastructure
> **Note**
> This will run the necessary PostgreSQL and Redis instances locally
```shell
docker compose up --build -d
```

1. Setup local database
```shell
yarn setup:dev
```

1. Run workout-tracker
```shell
yarn dev
```


</details>


## Reporting Bugs & Requesting Features
If you find a bug or have an idea for a new feature, feel free to open an issue. Please provide as much context as possible so that we can effectively address the problem or consider the feature request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


Enjoy using Workout Tracker, and happy coding!
