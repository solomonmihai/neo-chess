import { Container, Box, Button, Text, VStack, Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

import AuthStore from "../../stores/AuthStore";
import GameStore from "../../stores/GameStore";

async function fetchOpenGames() {
  const res = await axios.get("/games/open");

  const games = [];
  for (const game of res.data.games) {
    const userRes = await axios.get(`/user/${game.userId}`);
    const username = userRes.data.user.username;
    games.push({ id: game.id, username });
  }

  return games;
}

export default function Home() {
  const navigate = useNavigate();

  const user = AuthStore.useState((s) => s.user);
  const [openGames, setOpenGames] = useState([]);

  const socket = GameStore.useState((s) => s.socket);

  useEffect(() => {
    if (!socket) {
      GameStore.update((s) => {
        s.socket = io("localhost:3000");
      });
      return;
    }

    socket.on("open-games-update", () => {
      fetchOpenGames()
        .then((games) => {
          setOpenGames(games);
          console.log(games);
        })
        .catch((err) => {
          console.log("error fetching live games", err);
        });
    });
  }, [socket]);

  // TODO: if player is in live game redirect to game id

  useEffect(() => {
    fetchOpenGames()
      .then((games) => setOpenGames(games))
      .catch((err) => {
        console.log("error fetching live games", err);
      });
  }, []);

  function createGame() {
    axios
      .get("/games/new")
      .then((res) => {
        const { id } = res.data;

        // don't create game if already in one
        navigate(`/game/${id}`);
      })
      .catch((err) => {
        console.log("error creating game", err);
      });
  }

  // TODO: alternate grid list item colors

  return (
    <Container>
      <Text>logged in as {user.username}</Text>
      <Button onClick={createGame}>create game</Button>
      <VStack borderWidth={2} borderColor="purple.200" p="3" borderRadius="lg" width="400px">
        <Text fontWeight="bold" textAlign="center">
          games
        </Text>
        {openGames.length == 0 && <Text textAlign="center">no open games at the moment</Text>}

        {openGames.map((game, index) => (
          <Grid
            key={game.id}
            onClick={() => {
              navigate(`/game/${game.id}`);
            }}
            templateColumns="10% 45% 45%"
            padding="10px"
            width="full"
            borderRadius="lg"
            backgroundColor="gray.700"
            _hover={{
              backgroundColor: "purple.800",
              cursor: "pointer",
            }}
          >
            <GridItem>{index + 1}.</GridItem>
            <GridItem>{game.username}</GridItem>
            <GridItem>{game.id}</GridItem>
          </Grid>
        ))}
      </VStack>
    </Container>
  );
}
