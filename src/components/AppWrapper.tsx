import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import AppNavigator from "../navigation/AppNavigator";
import { ActivityIndicator, View } from "react-native";

export default function AppWrapper() {
  const loadAuth = useAuth((state) => state.loadAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}
