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
  blueContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.6,
    backgroundColor: colors.verdeOscuro,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  subtitle: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 40,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.white,
    padding: 24,
    width: width - 48,
    borderRadius: 16,
    shadowColor: colors.verdeOscuro,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.verdeOscuro,
    marginBottom: 24,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
    borderRadius: 12,
    overflow: 'hidden',
  },
  icon: {
    padding: 12,
    color: colors.verdeOscuro,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: colors.verdeOscuro,
    fontSize: 15,
    fontWeight: 'bold',
  },
  showPasswordButton: {
    padding: 12,
  },
  button: {
    backgroundColor: colors.verdeOscuro,
    borderRadius: 12,
    marginTop: 24,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});