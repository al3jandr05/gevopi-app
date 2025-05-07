import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighterCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.darkBlue,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  blueContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.6,
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  subtitle: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    padding: 28,
    width: width - 48,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkBlue,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.darkBlue,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: 'transparent',  // Para que sea limpio
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
