import { StyleSheet, Dimensions } from 'react-native';
import colors from '../themes/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.verdeOscuro,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 5,
    backgroundColor: colors.verdeOscuro,
    borderRadius: 15,
  },
  blueContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.6,
    backgroundColor: colors.verdeOscuro,
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
    color: colors.verdeOscuro,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colors.verdeOscuro,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.verdeOscuro,
  },
  button: {
    backgroundColor: colors.verdeOscuro,
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