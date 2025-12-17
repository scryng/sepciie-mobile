import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    FlatList,
    InteractionManager,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export type Option = {
    label: string,
    value: string,
}

type Props = {
    value?: string;
    valueDescription?: string,
    label?: string,
    placeholder?: string;
    searchPlaceholder?: string,
    icon?: string,
    disabled?: boolean;
    options: Array<Option>,
    onSelect: (option: Option | null) => void;
    onEndReached?: () => void,
};

export default function SelectWithModal({
    value,
    onSelect,
    onEndReached,
    placeholder = 'Selecionar',
    searchPlaceholder = 'Buscar',
    label = 'Selecionar',
    options,
    icon,
    disabled,
    valueDescription,
}: Props) {
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState('');
    const timeoutRef = useRef<number | null>(null);
    const [debounced, setDebounced] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const sheetAnim = useRef(new Animated.Value(0)).current;

    // Busca: debounce
    const onChange = (s: string) => {
        setTerm(s);
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = setTimeout(() => setDebounced(s), 600);
    };

    // Abrir: iniciar animações após pintura
    useEffect(() => {
        if (!open) return;
        sheetAnim.setValue(0);
        const raf = requestAnimationFrame(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0.4,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(sheetAnim, {
                    toValue: 1,
                    bounciness: 2,
                    speed: 2,
                    velocity: 0.5,
                    useNativeDriver: true,
                }),
            ]).start();
        });
        return () => cancelAnimationFrame(raf);
    }, [open, fadeAnim, sheetAnim]);

    const smoothClose = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(sheetAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            // agenda o setState depois das interações/anim
            InteractionManager.runAfterInteractions(() => setOpen(false));
        });
    };

    const filtered = useMemo(() => {
        const s = debounced.trim().toLowerCase();
        if (!s) return options;
        return options.filter((opt) => opt.label?.toLowerCase().includes(s) || opt.value?.toLowerCase().includes(s));
    }, [options, debounced]);

    const selectedLabel = useMemo(() => {
        const option = options.find((opt) => opt.value === value);
        return option?.label;
    }, [options, value]);

    return (
        <>
            <Text
                className="text-lg font-bold text-foreground py-2"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {label}
            </Text>

            {/* Campo do select */}
            <Pressable
                disabled={disabled}
                onPress={() => setOpen(true)}
                className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border bg-surface border-input-border ${disabled ? 'opacity-60' : ''
                    }`}
            >
                <View className="flex-row items-center flex-1 min-w-0 gap-2">
                    <MaterialIcons name={icon as any ?? "business"} size={18} color="#888" />
                    <Text
                        className="flex-1 font-medium text-text shrink"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {selectedLabel ?? (value != null && valueDescription != null ? valueDescription :  placeholder)}
                    </Text>
                </View>

                {value ? (
                    <Pressable
                        onPress={() => onSelect(null)}
                        hitSlop={10}
                        className="ml-2"
                    >
                        <MaterialIcons name="close" size={20} color="#888" />
                    </Pressable>
                ) : (
                    <View pointerEvents="none">
                        <MaterialIcons name="arrow-drop-down" size={22} color="#888" />
                    </View>
                )}
            </Pressable>

            {/* Modal de seleção */}
            <Modal
                visible={open}
                transparent
                animationType="none"
                statusBarTranslucent
            >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {/* Overlay animado */}
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: 'black', opacity: fadeAnim },
                        ]}
                    >
                        <Pressable style={{ flex: 1 }} onPress={smoothClose} />
                    </Animated.View>

                    {/* Sheet animado */}
                    <Animated.View
                        style={{
                            height: '75%',
                            backgroundColor: 'white',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 0,
                            transform: [
                                {
                                    translateY: sheetAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [400, 0],
                                    }),
                                },
                            ],
                        }}
                    >
                        <View className="h-[75%] flex-1 rounded-t-3xl bg-background p-4 border border-border">
                            {/* Header */}
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-lg font-semibold text-text">
                                    {label}
                                </Text>
                                <Pressable onPress={smoothClose}>
                                    <MaterialIcons name="close" size={22} color="#888" />
                                </Pressable>
                            </View>

                            {/* Busca */}
                            <View className="flex-row items-center gap-2 px-4 py-3 mb-3 border rounded-2xl bg-surface border-input-border">
                                <MaterialIcons name="search" size={18} color="#888" />
                                <TextInput
                                    value={term}
                                    onChangeText={onChange}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor="gray"
                                    className="flex-1 text-text"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {term.length > 0 && (
                                    <Pressable onPress={() => onChange('')}>
                                        <MaterialIcons name="close" size={18} color="#888" />
                                    </Pressable>
                                )}
                            </View>

                            <FlatList
                                data={filtered}
                                keyExtractor={(opt) => opt.value}
                                keyboardShouldPersistTaps="handled"
                                onEndReached={onEndReached}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            onSelect(item);
                                            smoothClose();
                                            onChange('');
                                        }}
                                        className="px-3 py-3 border-b border-border active:opacity-80"
                                    >
                                        <View className="flex-row items-center min-w-0">
                                            <Text
                                                className="flex-1 font-medium text-text shrink"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {item.label}
                                            </Text>
                                        </View>
                                    </Pressable>
                                )}
                                // ListFooterComponent={
                                //     <View className="items-center py-4">
                                //         <ActivityIndicator />
                                //     </View>
                                // }
                                ListEmptyComponent={
                                    <View className="items-center py-8">
                                        <MaterialIcons name="search-off" size={28} color="#999" />
                                        <Text className="mt-2 text-text-muted">
                                            Nenhum item encontrado
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
}
