@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    // Construtor...

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }
}