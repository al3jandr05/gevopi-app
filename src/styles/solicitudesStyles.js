import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fondo,
        padding: 16,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.naranjaFuerte,
        marginLeft: 10,
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    filtroButton: {
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.naranjaFuerte,
    },
    input: {
        backgroundColor: colors.blanco,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        fontSize: 14,
        color: colors.textoPrincipal,
        height: 40,
        borderWidth: 1,
        borderColor: colors.naranjaFuerte,
        marginBottom: 12,
    },
    search: {
        backgroundColor: colors.blanco,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        fontSize: 14,
        color: colors.textoPrincipal,
        height: 40,
        borderWidth: 1,
        borderColor: colors.naranjaFuerte,
    },

    reiniciarButton: {
        backgroundColor: colors.rojo,
        padding: 12,
        borderRadius: 12,
        marginLeft: 8,
    },
    card: {
        backgroundColor: colors.blanco,
        borderRadius: 15,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.amarillo,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.amarillo,
        paddingBottom: 12,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.amarillo,
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        
    },
    priorityText: {
        color: colors.blanco,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingRight: 8,
    },
    cardSubtitle: {
        flex: 1,
        fontSize: 14,
        color: colors.textoPrincipal,
        marginLeft: 8,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardFecha: {
        fontSize: 13,
        color: colors.azulOscuro, 
        marginLeft: 6,
        fontWeight: 'bold',
    },
    cardState: {
        fontSize: 13,
        color: colors.black,
        fontWeight: 'bold',

        marginLeft: 6,
    },
    mapContainer: {
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: colors.blanco,
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    locationText: {
        fontSize: 12,
        color: colors.amarillo,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.card2,
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.naranjaFuerte,
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textoPrincipal,
        marginBottom: 8,
    },
    datePicker: {
        padding: 14,
        backgroundColor: colors.blanco,
        borderRadius: 10,
        marginBottom: 10,
    },
    applyButton: {
        backgroundColor: colors.naranjaFuerte,
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
        alignItems: 'center',
    },
    applyButtonText: {
        color: colors.blanco,
        fontWeight: 'bold',
    },
    emptyText: {
        color: colors.textoPrincipal,
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});