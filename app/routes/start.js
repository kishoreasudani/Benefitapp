import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../assets/Images/index";
import { createStackNavigator, createSwitchNavigator, BottomTabBar, createBottomTabNavigator } from "react-navigation";
import LandingScreen from "../screens/Landing";
import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import SignupCreatePasswordScreen from "../screens/SignupCreatePassword";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import OtpScreen from "../screens/Otp";
import UpdatePasswordScreen from "../screens/UpdatePassword";
import ChangePasswordScreen from "../screens/ChangePassword";
import AboutUsScreen from "../screens/AboutUs";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import MyRewardsScreen from "../screens/MyRewards";
import AllRewardsScreen from "../screens/AllRewards";
import MyCoinsScreen from "../screens/MyCoins";
import SettingsScreen from "../screens/Settings";
import TermsAndConditionsScreen from "../screens/TermsAndConditions";
import FaqScreen from "../screens/FAQs";
import PrivacyPolicyScreen from "../screens/PrivacyPolicy";
import NotificationScreen from "../screens/Notifications";
import WeekGraphScreen from "../screens/WeekGraph";
import MonthGraphScreen from "../screens/MonthGraph";
import ViewRewardScreen from "../screens/ViewReward";
import audioScreen from "../screens/audio";
//import { Images } from "../assets/images/index";
const TabBarComponent = props => <BottomTabBar { ...props } />;
const LoggedOutStack = createStackNavigator({
  Landing: {
    screen: LandingScreen
  }, Login: {
    screen: LoginScreen
  }, Signup: {
    screen: SignupScreen
  }, SignupCreatePassword: {
    screen: SignupCreatePasswordScreen
  }, ForgotPassword: {
    screen: ForgotPasswordScreen
  }, Otp: {
    screen: OtpScreen
  }, UpdatePassword: {
    screen: UpdatePasswordScreen
  },
}, {
  initialRouteName: "Landing",
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const DashboardStack = createStackNavigator({
  Home: {
    screen: HomeScreen
  }, ChangePassword: {
    screen: ChangePasswordScreen
  }, Profile: {
    screen: ProfileScreen
  }, WeekGraph: {
    screen: WeekGraphScreen
  },
  MonthGraph: {
    screen: MonthGraphScreen
  }

}, {
  initialRouteName: "Home",
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const MyCoinsStack = createStackNavigator({
  MyCoins: {
    screen: MyCoinsScreen
  },
  MyRewards: {
    screen: MyRewardsScreen
  },
}, {
  initialRouteName: "MyCoins",
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }

});

const RewardsStack = createStackNavigator({

  AllRewards: {
    screen: AllRewardsScreen
  },
  ViewReward: {
    screen: ViewRewardScreen
  }
}, {
  initialRouteName: "AllRewards",
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const SettingStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen
  },
  FAQs: {
    screen: FaqScreen
  },
  PrivacyPolicy: {
    screen: PrivacyPolicyScreen
  },
  Notifications: {
    screen: NotificationScreen
  },
  TermsAndConditions: {
    screen: TermsAndConditionsScreen
  },
  AboutUs: {
    screen: AboutUsScreen
  },
  Profile: {
    screen: ProfileScreen
  },
  audio: {
    screen: audioScreen
  }
}, {
  initialRouteName: "Settings",
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
const tabBarOptions = {
  activeTintColor: "#441f87",
  inactiveTintColor: "#B7B7B7",
  activeBackgroundColor: "#000",
  inactiveBackgroundColor: "#000",
  labelStyle: {
    fontSize: 12,
    //color: '#3CB371'
  },
};
const LoggedInTabs = createBottomTabNavigator({
  DASHBOARD: {
    screen: DashboardStack,
    navigationOptions: {
      drawerLabel: "DASHBOARD",

      tabBarIcon: ({ focused }) => {
        var icon = focused ?
          Images.MenuOn :
          Images.MenuOff;
        return <Image style={ { height: 20, width: 20 } } source={ (icon) } />;
      },
      tabBarOptions: {
        activeTintColor: "#3CB371",
        inactiveTintColor: "#676767",
        activeBackgroundColor: "#000",
        inactiveBackgroundColor: "#000",
        labelStyle: {
          fontSize: 12,
          //color: '#3CB371'
        },
      },
      tabBarComponent: props => (
        <TabBarComponent { ...props } style={ { borderTopColor: '#000' } } />
      ),
      animationEnabled: true
    }
  },
  MYCOINS: {
    screen: MyCoinsStack,
    navigationOptions: {
      drawerLabel: "MyCoins",
      tabBarIcon: ({ focused }) => {
        var icon = focused ? Images.coinsOn : Images.coinsOff;
        return <Image style={ { height: 20, width: 20 } } source={ (icon) } />;
      },
      tabBarOptions: {
        activeTintColor: "#3CB371",
        inactiveTintColor: "#676767",
        activeBackgroundColor: "#000",
        inactiveBackgroundColor: "#000",

        labelStyle: {
          fontSize: 12,
          //color: '#3CB371'
        },
      },
      tabBarComponent: props => (
        <TabBarComponent { ...props } style={ { borderTopColor: '#000' } } />
      ),
      animationEnabled: true
    }
  },
  REWARDS: {
    screen: RewardsStack,
    navigationOptions: {
      drawerLabel: "Rewards",
      tabBarIcon: ({ focused }) => {
        var icon = focused ? Images.rewardsOn : Images.rewardsOff;
        return <Image style={ { height: 20, width: 20 } } source={ (icon) } />;
      },
      tabBarOptions: {
        activeTintColor: "#3CB371",
        inactiveTintColor: "#676767",
        activeBackgroundColor: "#000",
        inactiveBackgroundColor: "#000",
        labelStyle: {
          fontSize: 12,
          //color: '#3CB371'
        },
      },
      tabBarComponent: props => (
        <TabBarComponent { ...props } style={ { borderTopColor: '#000' } } />
      ),
      animationEnabled: true
    }
  },
  SETTINGS: {
    screen: SettingStack,
    navigationOptions: {
      drawerLabel: "Settings",
      tabBarIcon: ({ focused }) => {
        var icon = focused ? Images.settingsOn : Images.settingsOff;
        return <Image style={ { height: 20, width: 20 } } source={ (icon) } />;
      },

      tabBarOptions: {
        activeTintColor: "#3CB371",
        inactiveTintColor: "#676767",
        activeBackgroundColor: "#000",
        inactiveBackgroundColor: "#000",
        labelStyle: {
          fontSize: 12,
          //color: '#3CB371'
        },
      },
      tabBarComponent: props => (
        <TabBarComponent { ...props } style={ { borderTopColor: '#000' } } />
      ),
      animationEnabled: true
    }
  },
},
  {
    tabBarOptions: {
      showIcon: true
    }
  }
);

const RootStackCreator = (signedIn = false) => {
  return createSwitchNavigator({
    LoggedOut: {
      screen: LoggedOutStack
    },
    LoggedIn: {
      screen: LoggedInTabs
    }
  }, {
    initialRouteName: signedIn ? "LoggedIn" : "LoggedOut"
  }
  );
};
export default RootStackCreator;