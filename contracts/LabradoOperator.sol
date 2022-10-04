// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Labrado Operator contract
 * @dev Operator contract use for deposit token token or nft (ERC20/Native/ERC721 token)
 * @author Labrado
 */
contract LabradoOperator is AccessControlEnumerable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => bool) public supportTokens; // (address token => status true/false)
    mapping(address => bool) public supportNfts; // (address nft => status true/false)

    address private operatorWallet;

    event DepositToken(
        address depositContract,
        address indexed from,
        uint256 value
    );
    event DepositNFT(
        address depositContract,
        address indexed from,
        uint256 tokenId
    );

    constructor(address _operatorWallet) {
        require(
            _operatorWallet != address(0),
            "LabradoOperator: _operatorWallet must different zero-address"
        );
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        operatorWallet = _operatorWallet;
    }

    /*******************
     * Setting functions
     *******************/

    /**
     * @dev Set ERC20 token support status
     * - Can only be called by user has role admin
     * @param _token Address token
     * @param _status Status true/false support
     **/
    function setSupportTokens(address _token, bool _status) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "LabradoOperator: caller is not admin"
        );
        supportTokens[_token] = _status;
    }

    /**
     * @dev Set NFT token support status
     * - Can only be called by user has role admin
     * @param _nft Address token
     * @param _status Status true/false support
     **/
    function setSupportNfts(address _nft, bool _status) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "LabradoOperator: caller is not admin"
        );
        supportNfts[_nft] = _status;
    }

    /**
     * @dev Set new operatorWallet for contract
     * - Can only be called by user has role admin
     * @param _operatorWallet Address new operatorWallet
     **/
    function setOperatorWallet(address _operatorWallet) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "LabradoOperator: caller is not admin"
        );

        require(
            _operatorWallet != address(0),
            "LabradoOperator: _operatorWallet must different zero-address"
        );

        operatorWallet = _operatorWallet;
    }

    /**************************
     * Fungible Token functions
     **************************/

    /**
     * @dev User will use this function for the deposit of ERC20 tokens or native tokens
     * - Can be called by everyone
     * @param _token Address token will deposit
     * @param _amount Is amount token will deposit
     **/
    function depositToken(address _token, uint256 _amount) public payable {
        require(supportTokens[_token], "LabradoOperator: token is not support");
        if (_token == address(0)) {
            require(
                msg.value >= _amount,
                "LabradoOperator: msg.value must equal amount"
            );
            payable(operatorWallet).transfer(_amount);
        } else {
            require(
                IERC20(_token).balanceOf(_msgSender()) >= _amount,
                "LabradoOperator: balanceOf token is not enough"
            );
            IERC20(_token).safeTransferFrom(
                _msgSender(),
                operatorWallet,
                _amount
            );
        }
        emit DepositToken(_token, _msgSender(), _amount);
    }

    /**
     * @dev Withdraw tokens stuck in contract when users wrong transfer
     * - Can only be called by user has role DEFAULT_ADMIN_ROLE
     * @param _token Address token will withdraw
     * @param _amount Is amount token will withdraw
     **/
    function withdrawTokensStuck(address _token, uint256 _amount)
        public
        payable
        nonReentrant
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "LabradoOperator: caller is not admin"
        );

        if (_token == address(0)) {
            payable(_msgSender()).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(_msgSender(), _amount);
        }
    }

    /**
     * @dev Withdraw all tokens stuck in contract when users wrong transfer
     * - Can only be called by user has role DEFAULT_ADMIN_ROLE
     * @param _token Address token will withdraw
     **/
    function withdrawAllTokensStuck(address _token)
        public
        payable
        nonReentrant
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "LabradoOperator: caller is not admin"
        );

        if (_token == address(0)) {
            payable(_msgSender()).transfer(address(this).balance);
        } else {
            IERC20(_token).safeTransfer(
                _msgSender(),
                IERC20(_token).balanceOf(address(this))
            );
        }
    }

    /******************************
     * Non-Fungible Token functions
     ******************************/

    /**
     * @dev User will use this function for NFT deposit
     * - Can be called by everyone
     * @param _nft Address nft will deposit
     * @param _tokenId Is token id of nft
     **/
    function depositNFT(address _nft, uint256 _tokenId) public {
        require(supportNfts[_nft], "LabradoOperator: nft not support");
        require(
            IERC721(_nft).ownerOf(_tokenId) == _msgSender(),
            "LabradoOperator: sender is not owner tokenId"
        );

        IERC721(_nft).safeTransferFrom(_msgSender(), operatorWallet, _tokenId);

        emit DepositNFT(_nft, _msgSender(), _tokenId);
    }

    /****************
     * View functions
     ****************/

    // @dev Check if the address is operatorWallet
    // @param _operatorWallet Is address need check
    function isOperator(address _operatorWallet) public view returns (bool) {
        return operatorWallet == _operatorWallet ? true : false;
    }
}
