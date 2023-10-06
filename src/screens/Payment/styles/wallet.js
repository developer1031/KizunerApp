
const styles = StyleSheet.create({
    wrapper: {flex: 1},
    backBtn: {
      position: 'absolute',
      top: getStatusBarHeight() + getSize.h(20),
      left: getSize.w(24),
      zIndex: 10,
    },
    headerTitle: {
      top: getStatusBarHeight() + getSize.h(26),
      textAlign: 'center',
    },
    menuItemWrap: {
      paddingHorizontal: getSize.h(24),
    },
    menuItemContainer: {
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: getSize.h(1),
      minHeight: getSize.h(64),
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: getSize.h(12),
    },
    menuItemWrapLabel: {
      fontSize: getSize.f(15),
      color: theme.colors.tagTxt,
      fontFamily: theme.fonts.sfPro.medium,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: getSize.w(19),
      width: getSize.w(24),
    },
  })