@Entity
@Table(name = "users")
public class User implements UserDetails {

    private String username;
    private String password; 

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER")); 
    }

}