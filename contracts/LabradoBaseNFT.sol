//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Labrado Base NFT contract
 * @dev This contract is a base for Labrado nfts types
 * @author Labrado
 **/
contract LabradoBaseNFT is
    AccessControl,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721Pausable
{
    using Counters for Counters.Counter;

    struct TokenIdAndURI {
        uint256 tokenId;
        string tokenURI;
    }

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Counters.Counter private tokenIds;
    string public baseUri = "";

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseUri
    ) ERC721(_name, _symbol) {
        baseUri = _baseUri;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    /**
     * @dev Set pause for contract
     * - Can only be called by user has role admin
     **/
    function pause() public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            string(abi.encodePacked(symbol(), ": caller is not admin"))
        );
        _pause();
    }

    /**
     * @dev Set unpause for contract
     * - Can only be called by user has role admin
     **/
    function unpause() public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            string(abi.encodePacked(symbol(), ": caller is not admin"))
        );
        _unpause();
    }

    /**
     * @dev Mint new nft
     * - Can only be called by users have role MINTER_ROLE
     * @param _user Address owner of new NFT
     **/
    function mint(address _user) external returns (uint256) {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            string(abi.encodePacked(symbol(), ": Caller is not a minter"))
        );
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        _safeMint(_user, newTokenId);
        return newTokenId;
    }

    /**
     * @dev Mint new multiple NFTs in a transaction for multiple owners
     * - Can only be called by users have role MINTER_ROLE
     * @param _users Is array owners of new nfts
     **/
    function mintByBatch(address[] memory _users)
        external
        returns (uint256[] memory)
    {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            string(abi.encodePacked(symbol(), ": Caller is not a minter"))
        );

        uint256[] memory newTokenIds = new uint256[](_users.length);
        for (uint256 i = 0; i < _users.length; i++) {
            tokenIds.increment();
            uint256 newTokenId = tokenIds.current();

            _safeMint(_users[i], newTokenId);
            newTokenIds[i] = newTokenId;
        }

        return newTokenIds;
    }

    /**
     * @dev Set new baseUri for all nfts
     * - Can only be called by users have role DEFAULT_ADMIN_ROLE
     * @param _baseUri Is new baseUri has format string url
     **/
    function setBaseUri(string memory _baseUri) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            string(abi.encodePacked(symbol(), ": caller is not admin"))
        );
        baseUri = _baseUri;
    }

    /**
     * @dev Return baseUri of this contract
     * - This function is internal so it cannot be called from outside the contract
     **/
    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    /**
     * @dev Return NFTs of address _owner
     * - This function is public and view so anyone can call
     * @param _owner Is address want to check
     **/
    function getTokensByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(_owner);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 index = 0; index < balance; index++) {
            tokens[index] = tokenOfOwnerByIndex(_owner, index);
        }
        return tokens;
    }

    /**
     * @dev Return information NFTs of address _owner
     * - This function is public and view so anyone can call
     * @param _owner Is address want to check
     **/
    function getTokensAndTokenUriByOwner(address _owner)
        public
        view
        returns (TokenIdAndURI[] memory)
    {
        uint256 balance = balanceOf(_owner);
        TokenIdAndURI[] memory tokenIdsAndURIs = new TokenIdAndURI[](balance);
        for (uint256 index = 0; index < balance; index++) {
            uint256 tokenId = tokenOfOwnerByIndex(_owner, index);
            tokenIdsAndURIs[index].tokenId = tokenId;
            tokenIdsAndURIs[index].tokenURI = tokenURI(tokenId);
        }
        return tokenIdsAndURIs;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC721Enumerable, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
