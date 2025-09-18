import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import LancheCard from "../components/LancheCard";
import { useLanches } from "../store/useLanches";
import { ShoppingBag } from "lucide-react-native"; 

type Props = NativeStackScreenProps<RootStackParamList, "ProductLists">;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  padding: 20px 16px 8px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const ListContent = styled.View`
  padding: 0 16px 16px;
  flex: 1;
`;

const Empty = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.subtle};
  font-size: 16px;
  text-align: center;
  margin-top: 12px;
`;

const Separator = styled.View`
  height: 16px;
`;

export default function ProductList({ navigation }: Props) {
  const { lanches, removeLanche } = useLanches();

  return (
    <Container>
      <Header>
        <Title>Produtos</Title>
      </Header>

      <ListContent>
        <FlatList
          data={lanches}
          keyExtractor={(item, index) =>
            item?.id?.toString() ?? `lanche-${index}`
          }
          renderItem={({ item }) =>
            item ? (
              <LancheCard
                lanche={item}
                onOrder={() =>
                  navigation.navigate("PedidoCustom", {
                    lancheId: item.id,
                    mode: "cadastro",
                  })
                }
                onRemove={() => removeLanche(item.id)}
              />
            ) : null
          }
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <Empty>
              <ShoppingBag size={48} color="#999" />
              <EmptyText>Nenhum produto cadastrado ainda.</EmptyText>
            </Empty>
          }
          showsVerticalScrollIndicator={false}
        />
      </ListContent>
    </Container>
  );
}
