import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';

// Actions
const fetchDataRequest = () => {
  return {
    type: 'FETCH_DATA_REQUEST'
  };
};

const fetchDataSuccess = data => {
  return {
    type: 'FETCH_DATA_SUCCESS',
    payload: data
  };
};

const fetchDataFailure = error => {
  return {
    type: 'FETCH_DATA_FAILURE',
    payload: error
  };
};

const fetchData = () => {
  return dispatch => {
    dispatch(fetchDataRequest());
    fetch('https://randomuser.me/api/')
      .then(response => response.json())
      .then(data => {
        dispatch(fetchDataSuccess(data));
      })
      .catch(error => {
        dispatch(fetchDataFailure(error));
      });
  };
};

// Reducer
const initialState = {
  data: null,
  isLoading: false,
  error: null
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null
      };
    case 'FETCH_DATA_FAILURE':
      return {
        ...state,
        data: null,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// App Component
const App = () => {
  const data = useSelector(state => state.data);
  const isLoading = useSelector(state => state.isLoading);
  const error = useSelector(state => state.error);
  const dispatch = useDispatch();

  const handleFetchData = () => {
    dispatch(fetchData());
  };

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.text}>Loading data...</Text>
      ) : error ? (
        <Text style={styles.text}>Error: {error.message}</Text>
      ) : data ? (
        <Text style={styles.text}>Data: {JSON.stringify(data)}</Text>
      ) : null}
      <Button title="Fetch Data" onPress={handleFetchData} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    marginBottom: 16,
  },
});

// Store
const store = createStore(dataReducer, applyMiddleware(thunk));

// App Wrapper
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default ReduxApp;